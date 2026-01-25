import { RequestHandler } from 'express';
import { supabase } from '../supabase.ts';

export const getCustomers: RequestHandler = async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    
    const { data, error } = await supabase
      .from('customer_profiles')
      .select('*, user:user_id(*)')
      .limit(parseInt(limit as string));
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customers' });
  }
};

export const getCustomerById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('customer_profiles')
      .select('*, user:user_id(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customer' });
  }
};

export const getCustomerOrders: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customer orders' });
  }
};
