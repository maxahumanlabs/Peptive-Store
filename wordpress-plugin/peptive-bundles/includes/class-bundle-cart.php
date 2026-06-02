<?php
/**
 * Bundle Cart Handling
 * Manages bundle products in cart
 */

if (!defined('ABSPATH')) {
    exit;
}

class Peptive_Bundle_Cart {
    
    public function __construct() {
        add_filter('woocommerce_add_cart_item_data', array($this, 'add_bundle_cart_item_data'), 10, 3);
        add_filter('woocommerce_get_cart_item_from_session', array($this, 'get_bundle_cart_item_from_session'), 10, 3);
        add_filter('woocommerce_cart_item_name', array($this, 'bundle_cart_item_name'), 10, 3);
        add_filter('woocommerce_cart_item_subtotal', array($this, 'bundle_cart_item_subtotal'), 10, 3);
    }
    
    /**
     * Add bundle data to cart item
     */
    public function add_bundle_cart_item_data($cart_item_data, $product_id, $variation_id) {
        $product = wc_get_product($product_id);
        
        if ($product && $product->get_type() === 'bundle') {
            $bundle_items = get_post_meta($product_id, '_bundle_items', true);
            if (!empty($bundle_items)) {
                $cart_item_data['bundle_items'] = $bundle_items;
            }
        }
        
        return $cart_item_data;
    }
    
    /**
     * Get bundle data from session
     */
    public function get_bundle_cart_item_from_session($cart_item, $values, $key) {
        if (isset($values['bundle_items'])) {
            $cart_item['bundle_items'] = $values['bundle_items'];
        }
        
        return $cart_item;
    }
    
    /**
     * Display bundle contents in cart
     */
    public function bundle_cart_item_name($name, $cart_item, $cart_item_key) {
        if (isset($cart_item['bundle_items']) && !empty($cart_item['bundle_items'])) {
            $bundle_html = '<div class="bundle-contents" style="margin-top: 5px; font-size: 0.9em; color: #666;">';
            $bundle_html .= '<strong>' . __('Includes:', 'peptive-bundles') . '</strong><br>';
            
            foreach ($cart_item['bundle_items'] as $item) {
                $bundled_product = wc_get_product($item['product_id']);
                if ($bundled_product) {
                    $bundle_html .= sprintf(
                        '• %s × %d<br>',
                        esc_html($bundled_product->get_name()),
                        $item['quantity']
                    );
                }
            }
            
            $bundle_html .= '</div>';
            $name .= $bundle_html;
        }
        
        return $name;
    }
    
    /**
     * Calculate bundle subtotal
     */
    public function bundle_cart_item_subtotal($subtotal, $cart_item, $cart_item_key) {
        // This is handled by the product price, but we could add custom logic here
        return $subtotal;
    }
}
