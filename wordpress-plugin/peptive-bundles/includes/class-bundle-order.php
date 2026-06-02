<?php
/**
 * Bundle Order Display
 * Shows bundled products in order details
 */

if (!defined('ABSPATH')) {
    exit;
}

class Peptive_Bundle_Order {
    
    public function __construct() {
        add_action('woocommerce_order_item_meta_end', array($this, 'display_bundle_items_in_order'), 10, 4);
        add_filter('woocommerce_order_item_name', array($this, 'bundle_order_item_name'), 10, 3);
        add_action('woocommerce_checkout_create_order_line_item', array($this, 'add_bundle_metadata'), 10, 4);
    }
    
    /**
     * Display bundled products in order details
     */
    public function display_bundle_items_in_order($item_id, $item, $order, $plain_text) {
        $product = $item->get_product();
        
        if (!$product || $product->get_type() !== 'bundle') {
            return;
        }
        
        $bundle_items = get_post_meta($product->get_id(), '_bundle_items', true);
        
        if (empty($bundle_items) || !is_array($bundle_items)) {
            return;
        }
        
        if ($plain_text) {
            echo "\n" . __('Bundle Contents:', 'peptive-bundles') . "\n";
            foreach ($bundle_items as $bundle_item) {
                $bundled_product = wc_get_product($bundle_item['product_id']);
                if ($bundled_product) {
                    echo sprintf(
                        "  - %s × %d\n",
                        $bundled_product->get_name(),
                        $bundle_item['quantity'] * $item->get_quantity()
                    );
                }
            }
        } else {
            echo '<div class="bundle-contents" style="margin-top: 10px; padding-left: 20px; font-size: 0.9em; color: #666;">';
            echo '<strong>' . __('Bundle Contents:', 'peptive-bundles') . '</strong><br>';
            echo '<ul style="margin: 5px 0; padding-left: 20px;">';
            
            foreach ($bundle_items as $bundle_item) {
                $bundled_product = wc_get_product($bundle_item['product_id']);
                if ($bundled_product) {
                    echo sprintf(
                        '<li>%s × %d</li>',
                        esc_html($bundled_product->get_name()),
                        $bundle_item['quantity'] * $item->get_quantity()
                    );
                }
            }
            
            echo '</ul>';
            echo '</div>';
        }
    }
    
    /**
     * Modify bundle product name in order
     */
    public function bundle_order_item_name($name, $item, $is_visible) {
        $product = $item->get_product();
        
        if ($product && $product->get_type() === 'bundle') {
            $name .= ' <span style="color: #999; font-size: 0.85em;">(' . __('Bundle', 'peptive-bundles') . ')</span>';
        }
        
        return $name;
    }
    
    /**
     * Add bundle metadata to order items
     */
    public function add_bundle_metadata($item, $cart_item_key, $values, $order) {
        if (isset($values['data']) && $values['data']->get_type() === 'bundle') {
            $bundle_items = get_post_meta($values['data']->get_id(), '_bundle_items', true);
            
            if (!empty($bundle_items)) {
                $item->add_meta_data('_bundle_items', $bundle_items, true);
            }
        }
    }
}
