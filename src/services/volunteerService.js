import { supabase } from '../lib/supabase';

class VolunteerService {
  // Get all volunteers
  async getVolunteers() {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.eq('role', 'volunteer')
        ?.eq('is_active', true)
        ?.order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: { message: error?.message || 'Failed to fetch volunteers' } };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: { message: 'Network error while fetching volunteers' } };
    }
  }

  // Get volunteer assignments
  async getVolunteerAssignments(volunteerId) {
    try {
      const { data, error } = await supabase
        ?.from('volunteer_assignments')
        ?.select(`
          *,
          request:disaster_requests(*),
          volunteer:user_profiles(full_name, email, phone)
        `)
        ?.eq('volunteer_id', volunteerId)
        ?.order('assigned_at', { ascending: false });

      if (error) {
        return { data: [], error: { message: error?.message || 'Failed to fetch assignments' } };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: { message: 'Network error while fetching assignments' } };
    }
  }

  // Assign volunteer to request
  async assignVolunteerToRequest(volunteerId, requestId, notes = '') {
    try {
      // Create assignment record
      const { data: assignmentData, error: assignmentError } = await supabase
        ?.from('volunteer_assignments')
        ?.insert([{
          volunteer_id: volunteerId,
          request_id: requestId,
          notes,
          accepted_at: new Date()?.toISOString()
        }])
        ?.select()
        ?.single();

      if (assignmentError) {
        return { data: null, error: { message: assignmentError?.message || 'Failed to create assignment' } };
      }

      // Update request status
      const { data: requestData, error: requestError } = await supabase
        ?.from('disaster_requests')
        ?.update({ 
          assigned_volunteer_id: volunteerId,
          status: 'in-progress'
        })
        ?.eq('id', requestId)
        ?.select(`
          *,
          requester:user_profiles!disaster_requests_requester_id_fkey(full_name, email, phone),
          assigned_volunteer:user_profiles!disaster_requests_assigned_volunteer_id_fkey(full_name, email, phone)
        `)
        ?.single();

      if (requestError) {
        // Rollback assignment if request update fails
        await supabase?.from('volunteer_assignments')?.delete()?.eq('id', assignmentData?.id);
        return { data: null, error: { message: requestError?.message || 'Failed to update request' } };
      }

      return { data: { assignment: assignmentData, request: requestData }, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Network error while assigning volunteer' } };
    }
  }

  // Accept assignment (volunteer accepts a request)
  async acceptAssignment(assignmentId) {
    try {
      const { data, error } = await supabase
        ?.from('volunteer_assignments')
        ?.update({ accepted_at: new Date()?.toISOString() })
        ?.eq('id', assignmentId)
        ?.select(`
          *,
          request:disaster_requests(*),
          volunteer:user_profiles(full_name, email, phone)
        `)
        ?.single();

      if (error) {
        return { data: null, error: { message: error?.message || 'Failed to accept assignment' } };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Network error while accepting assignment' } };
    }
  }

  // Complete assignment
  async completeAssignment(assignmentId, completionNotes = '') {
    try {
      const { data: assignmentData, error: assignmentError } = await supabase
        ?.from('volunteer_assignments')
        ?.update({ 
          completed_at: new Date()?.toISOString(),
          notes: completionNotes
        })
        ?.eq('id', assignmentId)
        ?.select(`
          *,
          request:disaster_requests(id)
        `)
        ?.single();

      if (assignmentError) {
        return { data: null, error: { message: assignmentError?.message || 'Failed to complete assignment' } };
      }

      // Update request status to completed
      const { data: requestData, error: requestError } = await supabase
        ?.from('disaster_requests')
        ?.update({ 
          status: 'completed',
          completed_at: new Date()?.toISOString()
        })
        ?.eq('id', assignmentData?.request?.id)
        ?.select()
        ?.single();

      if (requestError) {
        return { data: null, error: { message: requestError?.message || 'Failed to update request status' } };
      }

      return { data: { assignment: assignmentData, request: requestData }, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Network error while completing assignment' } };
    }
  }

  // Get volunteer statistics
  async getVolunteerStats(volunteerId) {
    try {
      const { data, error } = await supabase
        ?.from('volunteer_assignments')
        ?.select('id, accepted_at, completed_at')
        ?.eq('volunteer_id', volunteerId);

      if (error) {
        return { 
          data: { totalAssignments: 0, completedAssignments: 0, activeAssignments: 0 }, 
          error: { message: error?.message || 'Failed to fetch statistics' } 
        };
      }

      const stats = {
        totalAssignments: data?.length || 0,
        completedAssignments: data?.filter(a => a?.completed_at)?.length || 0,
        activeAssignments: data?.filter(a => a?.accepted_at && !a?.completed_at)?.length || 0
      };

      return { data: stats, error: null };
    } catch (error) {
      return { 
        data: { totalAssignments: 0, completedAssignments: 0, activeAssignments: 0 }, 
        error: { message: 'Network error while fetching statistics' } 
      };
    }
  }

  // Get nearby requests for volunteer
  async getNearbyRequests(volunteerId, maxDistance = 50) {
    try {
      // First get volunteer location
      const { data: volunteerData, error: volunteerError } = await supabase
        ?.from('user_profiles')
        ?.select('location_lat, location_lng')
        ?.eq('id', volunteerId)
        ?.single();

      if (volunteerError || !volunteerData?.location_lat) {
        return { data: [], error: { message: 'Volunteer location not set' } };
      }

      // Get pending requests (simplified - real implementation would use PostGIS for distance calculation)
      const { data, error } = await supabase
        ?.from('disaster_requests')
        ?.select(`
          *,
          requester:user_profiles!disaster_requests_requester_id_fkey(full_name, email, phone)
        `)
        ?.eq('status', 'pending')
        ?.not('location_lat', 'is', null)
        ?.order('priority', { ascending: false });

      if (error) {
        return { data: [], error: { message: error?.message || 'Failed to fetch nearby requests' } };
      }

      // Simple distance filtering (in a real app, use PostGIS)
      const nearbyRequests = (data || [])?.filter(request => {
        if (!request?.location_lat || !request?.location_lng) return false;
        
        const distance = this.calculateDistance(
          volunteerData?.location_lat,
          volunteerData?.location_lng,
          request?.location_lat,
          request?.location_lng
        );
        
        return distance <= maxDistance;
      });

      return { data: nearbyRequests, error: null };
    } catch (error) {
      return { data: [], error: { message: 'Network error while fetching nearby requests' } };
    }
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Subscribe to new request assignments
  subscribeToAssignments(callback, volunteerId) {
    const channel = supabase
      ?.channel('volunteer_assignments')
      ?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'volunteer_assignments',
          filter: `volunteer_id=eq.${volunteerId}`
        },
        (payload) => {
          callback?.(payload);
        }
      )
      ?.subscribe();

    return channel;
  }

  // Unsubscribe from assignments
  unsubscribeFromAssignments(channel) {
    if (channel) {
      supabase?.removeChannel(channel);
    }
  }
}

export const volunteerService = new VolunteerService();