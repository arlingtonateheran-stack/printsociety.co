import { RequestHandler } from 'express';
import { supabase } from '../supabase.ts';

export const getOrders: RequestHandler = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status as string);
    }
    
    const { data, error } = await query.limit(parseInt(limit as string));
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
};

export const getOrderMetrics: RequestHandler = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('dashboard_metrics')
      .select('*')
      .single();
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch metrics' });
  }
};

export const updateOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    res.json({ success: true, data: data?.[0] });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, error: 'Failed to update order' });
  }
};
