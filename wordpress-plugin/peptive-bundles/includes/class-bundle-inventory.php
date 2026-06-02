<?php
/**
 * Bundle Inventory Management
 * Handles stock deduction for bundled products
 */

if (!defined('ABSPATH')) {
    exit;
}

class Peptive_Bundle_Inventory {
    
    public function __construct() {
        add_action('woocommerce_reduce_order_stock', array($this, 'reduce_bundle_stock'));
        add_action('woocommerce_restore_order_stock', array($this, 'restore_bundle_stock'));
        add_filter('woocommerce_product_get_stock_quantity', array($this, 'get_bundle_stock'), 10, 2);
        add_filter('woocommerce_product_is_in_stock', array($this, 'bundle_is_in_stock'), 10, 2);
        add_filter('woocommerce_product_get_stock_status', array($this, 'get_bundle_stock_status'), 10, 2);
        add_action('woocommerce_product_set_stock', array($this, 'update_bundle_stock_status'));
        add_action('woocommerce_variation_set_stock', array($this, 'update_bundle_stock_status'));
    }
    
    /**
     * Reduce stock for bundled products when order is placed
     */
    public function reduce_bundle_stock($order) {
        if (!is_a($order, 'WC_Order')) {
            $order = wc_get_order($order);
        }
        
        if (!$order) {
            return;
        }
        
        foreach ($order->get_items() as $item) {
            $product = $item->get_product();
            
            if ($product && $product->get_type() === 'bundle') {
                // Prevent default stock reduction for bundle product
                $product->set_stock_quantity($product->get_stock_quantity());
                
                // Reduce stock for each bundled product
                $bundle_items = get_post_meta($product->get_id(), '_bundle_items', true);
                
                if (!empty($bundle_items) && is_array($bundle_items)) {
                    foreach ($bundle_items as $bundle_item) {
                        $bundled_product = wc_get_product($bundle_item['product_id']);
                        
                        if ($bundled_product && $bundled_product->managing_stock()) {
                            $qty_to_reduce = $bundle_item['quantity'] * $item->get_quantity();
                            $new_stock = wc_update_product_stock($bundled_product, $qty_to_reduce, 'decrease');
                            
                            // Add order note
                            $order->add_order_note(
                                sprintf(
                                    __('Stock reduced for bundled product: %s (-%d)', 'peptive-bundles'),
                                    $bundled_product->get_name(),
                                    $qty_to_reduce
                                )
                            );
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Restore stock for bundled products when order is cancelled
     */
    public function restore_bundle_stock($order) {
        if (!is_a($order, 'WC_Order')) {
            $order = wc_get_order($order);
        }
        
        if (!$order) {
            return;
        }
        
        foreach ($order->get_items() as $item) {
            $product = $item->get_product();
            
            if ($product && $product->get_type() === 'bundle') {
                $bundle_items = get_post_meta($product->get_id(), '_bundle_items', true);
                
                if (!empty($bundle_items) && is_array($bundle_items)) {
                    foreach ($bundle_items as $bundle_item) {
                        $bundled_product = wc_get_product($bundle_item['product_id']);
                        
                        if ($bundled_product && $bundled_product->managing_stock()) {
                            $qty_to_restore = $bundle_item['quantity'] * $item->get_quantity();
                            $new_stock = wc_update_product_stock($bundled_product, $qty_to_restore, 'increase');
                            
                            $order->add_order_note(
                                sprintf(
                                    __('Stock restored for bundled product: %s (+%d)', 'peptive-bundles'),
                                    $bundled_product->get_name(),
                                    $qty_to_restore
                                )
                            );
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Get bundle stock quantity based on lowest stock of bundled products
     */
    public function get_bundle_stock($stock, $product) {
        if ($product->get_type() !== 'bundle') {
            return $stock;
        }
        
        $bundle_items = get_post_meta($product->get_id(), '_bundle_items', true);
        
        if (empty($bundle_items) || !is_array($bundle_items)) {
            return $stock;
        }
        
        $min_stock = PHP_INT_MAX;
        
        foreach ($bundle_items as $bundle_item) {
            $bundled_product = wc_get_product($bundle_item['product_id']);
            
            if ($bundled_product && $bundled_product->managing_stock()) {
                $available = floor($bundled_product->get_stock_quantity() / $bundle_item['quantity']);
                $min_stock = min($min_stock, $available);
            }
        }
        
        return $min_stock === PHP_INT_MAX ? null : max(0, $min_stock);
    }
    
    /**
     * Check if bundle is in stock based on bundled products
     * Bundle is out of stock if ANY component is out of stock
     */
    public function bundle_is_in_stock($is_in_stock, $product) {
        if ($product->get_type() !== 'bundle') {
            return $is_in_stock;
        }
        
        $bundle_items = get_post_meta($product->get_id(), '_bundle_items', true);
        
        if (empty($bundle_items) || !is_array($bundle_items)) {
            return $is_in_stock;
        }
        
        // Check each bundled product
        foreach ($bundle_items as $bundle_item) {
            $bundled_product = wc_get_product($bundle_item['product_id']);
            
            // If product doesn't exist, bundle is out of stock
            if (!$bundled_product) {
                return false;
            }
            
            // Check if bundled product is out of stock
            if ($bundled_product->get_stock_status() === 'outofstock') {
                return false;
            }
            
            // Check if bundled product is in stock
            if (!$bundled_product->is_in_stock()) {
                return false;
            }
            
            // If managing stock, check if sufficient quantity available
            if ($bundled_product->managing_stock()) {
                if ($bundled_product->get_stock_quantity() < $bundle_item['quantity']) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    /**
     * Get bundle stock status based on bundled products
     * Returns 'outofstock' if any component is out of stock
     */
    public function get_bundle_stock_status($stock_status, $product) {
        if ($product->get_type() !== 'bundle') {
            return $stock_status;
        }
        
        $bundle_items = get_post_meta($product->get_id(), '_bundle_items', true);
        
        if (empty($bundle_items) || !is_array($bundle_items)) {
            return $stock_status;
        }
        
        // Check each bundled product's stock status
        foreach ($bundle_items as $bundle_item) {
            $bundled_product = wc_get_product($bundle_item['product_id']);
            
            if (!$bundled_product) {
                return 'outofstock';
            }
            
            // If any component is out of stock, bundle is out of stock
            if ($bundled_product->get_stock_status() === 'outofstock') {
                return 'outofstock';
            }
            
            // Check if managing stock and insufficient quantity
            if ($bundled_product->managing_stock()) {
                if ($bundled_product->get_stock_quantity() < $bundle_item['quantity']) {
                    return 'outofstock';
                }
            }
        }
        
        return 'instock';
    }
    
    /**
     * Update bundle stock status when component products change
     */
    public function update_bundle_stock_status($product_id) {
        // Find all bundle products that contain this product
        $args = array(
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
            'meta_query'     => array(
                array(
                    'key'     => '_bundle_items',
                    'compare' => 'EXISTS',
                ),
            ),
        );
        
        $bundles = get_posts($args);
        
        foreach ($bundles as $bundle_post) {
            $bundle = wc_get_product($bundle_post->ID);
            
            if ($bundle && $bundle->get_type() === 'bundle') {
                $bundle_items = get_post_meta($bundle_post->ID, '_bundle_items', true);
                
                if (!empty($bundle_items) && is_array($bundle_items)) {
                    // Check if this product is in the bundle
                    foreach ($bundle_items as $item) {
                        if ($item['product_id'] == $product_id) {
                            // Update bundle stock status
                            $is_in_stock = $this->bundle_is_in_stock(true, $bundle);
                            $new_status = $is_in_stock ? 'instock' : 'outofstock';
                            
                            // Update the stock status
                            update_post_meta($bundle_post->ID, '_stock_status', $new_status);
                            
                            // Clear cache
                            wc_delete_product_transients($bundle_post->ID);
                            
                            break;
                        }
                    }
                }
            }
        }
    }
}
