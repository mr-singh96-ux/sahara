import { supabase } from '../lib/supabase';

class CommunicationService {
  // Send message/communication
  async sendMessage(messageData) {
    try {
      const { data, error } = await supabase
        ?.from('communications')
        ?.insert([{
          request_id: messageData?.request_id,
          sender_id: messageData?.sender_id,
          recipient_id: messageData?.recipient_id,
          message: messageData?.message,
          communication_type: messageData?.communication_type || 'sms'
        }])
        ?.select(`
          *,
          sender:user_profiles!communications_sender_id_fkey(full_name, email),
          recipient:user_profiles!communications_recipient_id_fkey(full_name, email)
        `)
        ?.single();

      if (error) {
        return { data: null, error: { message: error?.message || 'Failed to send message' } };
      }

      // TODO: Integrate with Twilio for actual SMS/call sending
      await this.sendViaTwilio(messageData);

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Network error while sending message' } };
    }
  }

  // Get communications for a request
  async getRequestCommunications(requestId) {
    try {
      const { data, error } = await supabase
        ?.from('communications')
        ?.select(`
          *,
          sender:user_profiles!communications_sender_id_fkey(full_name, email),
          recipient:user_profiles!communications_recipient_id_fkey(full_name, email)
        `)
        ?.eq('request_id', requestId)
        ?.order('sent_at', { ascending: true });

      if (error) {
        return { data: [], error: { message: error?.message || 'Failed to fetch communications' } };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: { message: 'Network error while fetching communications' } };
    }
  }

  // Get user communications
  async getUserCommunications(userId) {
    try {
      const { data, error } = await supabase
        ?.from('communications')
        ?.select(`
          *,
          request:disaster_requests(title, request_type),
          sender:user_profiles!communications_sender_id_fkey(full_name, email),
          recipient:user_profiles!communications_recipient_id_fkey(full_name, email)
        `)
        ?.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        ?.order('sent_at', { ascending: false });

      if (error) {
        return { data: [], error: { message: error?.message || 'Failed to fetch communications' } };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: { message: 'Network error while fetching communications' } };
    }
  }

  // Mark message as read
  async markAsRead(communicationId) {
    try {
      const { data, error } = await supabase
        ?.from('communications')
        ?.update({ read_at: new Date()?.toISOString() })
        ?.eq('id', communicationId)
        ?.select()
        ?.single();

      if (error) {
        return { data: null, error: { message: error?.message || 'Failed to mark as read' } };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Network error while updating read status' } };
    }
  }

  // Send via Twilio (placeholder implementation)
  async sendViaTwilio(messageData) {
    // This would integrate with Twilio API
    // For now, we'll just log the message
    try {
      // TODO: Implement actual Twilio integration
      console.log('Twilio Integration: Would send message:', {
        type: messageData?.communication_type,
        message: messageData?.message,
        to: messageData?.recipient_phone || 'Unknown',
        from: messageData?.sender_phone || 'System'
      });

      // Simulated successful send
      return { success: true, twilioSid: 'mock_sid_' + Date.now() };
    } catch (error) {
      console.error('Twilio integration error:', error);
      return { success: false, error: error?.message };
    }
  }

  // Send emergency alert to multiple recipients
  async sendEmergencyAlert(alertData) {
    try {
      const messages = alertData?.recipients?.map(recipient => ({
        request_id: alertData?.request_id,
        sender_id: alertData?.sender_id,
        recipient_id: recipient?.id,
        message: alertData?.message,
        communication_type: alertData?.communication_type || 'sms'
      }));

      const { data, error } = await supabase
        ?.from('communications')
        ?.insert(messages)
        ?.select(`
          *,
          sender:user_profiles!communications_sender_id_fkey(full_name, email),
          recipient:user_profiles!communications_recipient_id_fkey(full_name, email)
        `);

      if (error) {
        return { data: [], error: { message: error?.message || 'Failed to send emergency alert' } };
      }

      // Send via Twilio for each recipient
      for (const recipient of alertData?.recipients || []) {
        await this.sendViaTwilio({
          ...alertData,
          recipient_id: recipient?.id,
          recipient_phone: recipient?.phone
        });
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: { message: 'Network error while sending emergency alert' } };
    }
  }

  // Subscribe to real-time communications
  subscribeToCommunications(callback, userId) {
    const channel = supabase
      ?.channel('communications')
      ?.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'communications',
          filter: `recipient_id=eq.${userId}`
        },
        (payload) => {
          callback?.(payload);
        }
      )
      ?.subscribe();

    return channel;
  }

  // Unsubscribe from communications
  unsubscribeFromCommunications(channel) {
    if (channel) {
      supabase?.removeChannel(channel);
    }
  }
}

export const communicationService = new CommunicationService();