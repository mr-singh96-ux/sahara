import { supabase } from '../lib/supabase';

class RequestService {
  // Get all requests for current user based on role
  async getUserRequests(userId, role) {
    try {
      let query = supabase?.from('disaster_requests')?.select(`
        *,
        requester:user_profiles!disaster_requests_requester_id_fkey(full_name, email, phone),
        assigned_volunteer:user_profiles!disaster_requests_assigned_volunteer_id_fkey(full_name, email, phone)
      `);

      if (role === 'victim') {
        query = query?.eq('requester_id', userId);
      } else if (role === 'volunteer') {
        query = query?.or(`assigned_volunteer_id.eq.${userId},status.eq.pending`);
      }
      // NGO admin can see all requests due to RLS policy

      const { data, error } = await query?.order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: { message: error?.message || 'Failed to fetch requests' } };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: { message: 'Network error while fetching requests' } };
    }
  }

  // Create new disaster request
  async createRequest(requestData) {
    try {
      const { data, error } = await supabase
        ?.from('disaster_requests')
        ?.insert([requestData])
        ?.select(`
          *,
          requester:user_profiles!disaster_requests_requester_id_fkey(full_name, email, phone)
        `)
        ?.single();

      if (error) {
        return { data: null, error: { message: error?.message || 'Failed to create request' } };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Network error while creating request' } };
    }
  }

  // Update request status
  async updateRequestStatus(requestId, status, volunteerId = null) {
    try {
      const updates = { status };
      if (volunteerId) {
        updates.assigned_volunteer_id = volunteerId;
      }
      if (status === 'completed') {
        updates.completed_at = new Date()?.toISOString();
      }

      const { data, error } = await supabase
        ?.from('disaster_requests')
        ?.update(updates)
        ?.eq('id', requestId)
        ?.select(`
          *,
          requester:user_profiles!disaster_requests_requester_id_fkey(full_name, email, phone),
          assigned_volunteer:user_profiles!disaster_requests_assigned_volunteer_id_fkey(full_name, email, phone)
        `)
        ?.single();

      if (error) {
        return { data: null, error: { message: error?.message || 'Failed to update request' } };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Network error while updating request' } };
    }
  }

  // Assign volunteer to request
  async assignVolunteer(requestId, volunteerId) {
    return this.updateRequestStatus(requestId, 'in-progress', volunteerId);
  }

  // Get request details
  async getRequestDetails(requestId) {
    try {
      const { data, error } = await supabase
        ?.from('disaster_requests')
        ?.select(`
          *,
          requester:user_profiles!disaster_requests_requester_id_fkey(full_name, email, phone, address),
          assigned_volunteer:user_profiles!disaster_requests_assigned_volunteer_id_fkey(full_name, email, phone),
          request_updates(*, user:user_profiles(full_name)),
          communications(*, sender:user_profiles!communications_sender_id_fkey(full_name), recipient:user_profiles!communications_recipient_id_fkey(full_name))
        `)
        ?.eq('id', requestId)
        ?.single();

      if (error) {
        return { data: null, error: { message: error?.message || 'Request not found' } };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Network error while fetching request details' } };
    }
  }

  // Get requests by location (for map view)
  async getRequestsByLocation(bounds = null) {
    try {
      let query = supabase?.from('disaster_requests')?.select(`
        id, title, request_type, priority, status, location_lat, location_lng,
        location_address, people_affected, created_at,
        requester:user_profiles!disaster_requests_requester_id_fkey(full_name)
      `);

      if (bounds) {
        query = query
          ?.gte('location_lat', bounds?.south)
          ?.lte('location_lat', bounds?.north)
          ?.gte('location_lng', bounds?.west)
          ?.lte('location_lng', bounds?.east);
      }

      const { data, error } = await query?.not('location_lat', 'is', null);

      if (error) {
        return { data: [], error: { message: error?.message || 'Failed to fetch location data' } };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: { message: 'Network error while fetching location data' } };
    }
  }

  // Get dashboard statistics
  async getDashboardStats(userId, role) {
    try {
      let stats = {
        totalRequests: 0,
        pendingRequests: 0,
        inProgressRequests: 0,
        completedRequests: 0
      };

      let query = supabase?.from('disaster_requests')?.select('status');

      if (role === 'victim') {
        query = query?.eq('requester_id', userId);
      } else if (role === 'volunteer') {
        query = query?.eq('assigned_volunteer_id', userId);
      }
      // NGO admin sees all

      const { data, error } = await query;

      if (error) {
        return { data: stats, error: { message: error?.message || 'Failed to fetch statistics' } };
      }

      stats.totalRequests = data?.length || 0;
      stats.pendingRequests = data?.filter(r => r?.status === 'pending')?.length || 0;
      stats.inProgressRequests = data?.filter(r => r?.status === 'in-progress')?.length || 0;
      stats.completedRequests = data?.filter(r => r?.status === 'completed')?.length || 0;

      return { data: stats, error: null };
    } catch (error) {
      return { 
        data: { totalRequests: 0, pendingRequests: 0, inProgressRequests: 0, completedRequests: 0 }, 
        error: { message: 'Network error while fetching statistics' } 
      };
    }
  }

  // Subscribe to real-time request updates
  subscribeToRequests(callback, userId = null, role = null) {
    let channel = supabase
      ?.channel('disaster_requests')
      ?.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'disaster_requests'
        },
        (payload) => {
          callback?.(payload);
        }
      )
      ?.subscribe();

    return channel;
  }

  // Unsubscribe from real-time updates
  unsubscribeFromRequests(channel) {
    if (channel) {
      supabase?.removeChannel(channel);
    }
  }
}

export const requestService = new RequestService();