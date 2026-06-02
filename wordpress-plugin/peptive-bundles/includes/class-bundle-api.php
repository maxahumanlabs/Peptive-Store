<?php
/**
 * Bundle API Integration
 * Extends WooCommerce Store API for bundle products
 */

if (!defined('ABSPATH')) {
    exit;
}

class Peptive_Bundle_API {
    
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_rest_fields'));
        add_filter('woocommerce_rest_prepare_product_object', array($this, 'add_bundle_data_to_api'), 10, 3);
        
        // Add Store API support using the correct hook
        add_filter('woocommerce_store_api_product_quantity_editable', '__return_true');
        add_action('woocommerce_blocks_loaded', array($this, 'register_store_api_extension'));
    }
    
    /**
     * Register Store API extension
     */
    public function register_store_api_extension() {
        if (!function_exists('woocommerce_store_api_register_endpoint_data')) {
            return;
        }
        
        woocommerce_store_api_register_endpoint_data(
            array(
                'endpoint'        => 'product',
                'namespace'       => 'peptive-bundles',
                'data_callback'   => array($this, 'add_bundle_data_to_store_api_callback'),
                'schema_callback' => array($this, 'get_store_api_schema'),
                'schema_type'     => ARRAY_A,
            )
        );
    }
    
    /**
     * Store API data callback
     */
    public function add_bundle_data_to_store_api_callback($product) {
        if (!$product instanceof \WC_Product) {
            return array();
        }
        
        return array(
            'arabic_name'              => get_post_meta($product->get_id(), '_arabic_name', true) ?: '',
            'arabic_description'       => get_post_meta($product->get_id(), '_arabic_description', true) ?: '',
            'arabic_short_description' => get_post_meta($product->get_id(), '_arabic_short_description', true) ?: '',
            'arabic_tags'              => get_post_meta($product->get_id(), '_arabic_tags', true) ?: '',
            'bundle_pricing'           => array(
                'three_month' => array(
                    'regular_price' => get_post_meta($product->get_id(), '_bundle_3_month_regular_price', true) ?: '',
                    'sale_price'    => get_post_meta($product->get_id(), '_bundle_3_month_sale_price', true) ?: '',
                ),
                'six_month' => array(
                    'regular_price' => get_post_meta($product->get_id(), '_bundle_6_month_regular_price', true) ?: '',
                    'sale_price'    => get_post_meta($product->get_id(), '_bundle_6_month_sale_price', true) ?: '',
                ),
            ),
            'is_bundle'                => $product->get_type() === 'bundle',
            'bundle_items'             => $this->get_bundle_items_for_store_api($product),
        );
    }
    
    /**
     * Get bundle items for Store API
     */
    private function get_bundle_items_for_store_api($product) {
        if ($product->get_type() !== 'bundle') {
            return array();
        }
        
        $bundle_items = get_post_meta($product->get_id(), '_bundle_items', true);
        if (empty($bundle_items) || !is_array($bundle_items)) {
            return array();
        }
        
        $items_with_details = array();
        foreach ($bundle_items as $item) {
            $bundled_product = wc_get_product($item['product_id']);
            if ($bundled_product) {
                $items_with_details[] = array(
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'product'    => array(
                        'name'  => $bundled_product->get_name(),
                        'price' => $bundled_product->get_price(),
                        'image' => wp_get_attachment_url($bundled_product->get_image_id()),
                    ),
                );
            }
        }
        
        return $items_with_details;
    }
    
    /**
     * Store API schema
     */
    public function get_store_api_schema() {
        return array(
            'arabic_name'              => array(
                'description' => 'Product name in Arabic',
                'type'        => 'string',
            ),
            'arabic_description'       => array(
                'description' => 'Product description in Arabic',
                'type'        => 'string',
            ),
            'arabic_short_description' => array(
                'description' => 'Product short description in Arabic',
                'type'        => 'string',
            ),
            'arabic_tags'              => array(
                'description' => 'Product tags in Arabic',
                'type'        => 'string',
            ),
            'bundle_pricing'           => array(
                'description' => 'Bundle pricing options',
                'type'        => 'object',
            ),
            'is_bundle'                => array(
                'description' => 'Whether product is a bundle',
                'type'        => 'boolean',
            ),
            'bundle_items'             => array(
                'description' => 'Bundle items',
                'type'        => 'array',
            ),
        );
    }
    
    /**
     * Register REST API fields for bundle products
     */
    public function register_rest_fields() {
        // Bundle items field
        register_rest_field('product', 'bundle_items', array(
            'get_callback' => array($this, 'get_bundle_items_field'),
            'schema'       => array(
                'description' => __('Bundle product items', 'peptive-bundles'),
                'type'        => 'array',
                'context'     => array('view', 'edit'),
                'items'       => array(
                    'type'       => 'object',
                    'properties' => array(
                        'product_id' => array(
                            'type' => 'integer',
                        ),
                        'quantity' => array(
                            'type' => 'integer',
                        ),
                        'product' => array(
                            'type' => 'object',
                        ),
                    ),
                ),
            ),
        ));
        
        register_rest_field('product', 'is_bundle', array(
            'get_callback' => array($this, 'get_is_bundle_field'),
            'schema'       => array(
                'description' => __('Whether product is a bundle', 'peptive-bundles'),
                'type'        => 'boolean',
                'context'     => array('view', 'edit'),
            ),
        ));
        
        // Arabic translation fields
        register_rest_field('product', 'arabic_name', array(
            'get_callback' => array($this, 'get_arabic_name_field'),
            'schema'       => array(
                'description' => __('Product name in Arabic', 'peptive-bundles'),
                'type'        => 'string',
                'context'     => array('view', 'edit'),
            ),
        ));
        
        register_rest_field('product', 'arabic_description', array(
            'get_callback' => array($this, 'get_arabic_description_field'),
            'schema'       => array(
                'description' => __('Product description in Arabic', 'peptive-bundles'),
                'type'        => 'string',
                'context'     => array('view', 'edit'),
            ),
        ));
        
        register_rest_field('product', 'arabic_short_description', array(
            'get_callback' => array($this, 'get_arabic_short_description_field'),
            'schema'       => array(
                'description' => __('Product short description in Arabic', 'peptive-bundles'),
                'type'        => 'string',
                'context'     => array('view', 'edit'),
            ),
        ));
        
        register_rest_field('product', 'arabic_tags', array(
            'get_callback' => array($this, 'get_arabic_tags_field'),
            'schema'       => array(
                'description' => __('Product tags in Arabic', 'peptive-bundles'),
                'type'        => 'string',
                'context'     => array('view', 'edit'),
            ),
        ));
        
        // Bundle pricing fields
        register_rest_field('product', 'bundle_pricing', array(
            'get_callback' => array($this, 'get_bundle_pricing_field'),
            'schema'       => array(
                'description' => __('Bundle pricing for 3-month and 6-month options', 'peptive-bundles'),
                'type'        => 'object',
                'context'     => array('view', 'edit'),
                'properties' => array(
                    'three_month' => array(
                        'type' => 'object',
                        'properties' => array(
                            'regular_price' => array('type' => 'string'),
                            'sale_price' => array('type' => 'string'),
                        ),
                    ),
                    'six_month' => array(
                        'type' => 'object',
                        'properties' => array(
                            'regular_price' => array('type' => 'string'),
                            'sale_price' => array('type' => 'string'),
                        ),
                    ),
                ),
            ),
        ));
    }
    
    /**
     * Get bundle items field for API
     */
    public function get_bundle_items_field($object) {
        $product = wc_get_product($object['id']);
        
        if (!$product || $product->get_type() !== 'bundle') {
            return array();
        }
        
        $bundle_items = get_post_meta($object['id'], '_bundle_items', true);
        
        if (empty($bundle_items) || !is_array($bundle_items)) {
            return array();
        }
        
        $items_with_details = array();
        
        foreach ($bundle_items as $item) {
            $bundled_product = wc_get_product($item['product_id']);
            
            if ($bundled_product) {
                $items_with_details[] = array(
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'product'    => array(
                        'id'    => $bundled_product->get_id(),
                        'name'  => $bundled_product->get_name(),
                        'slug'  => $bundled_product->get_slug(),
                        'price' => $bundled_product->get_price(),
                        'image' => wp_get_attachment_image_url($bundled_product->get_image_id(), 'thumbnail'),
                        'stock_status' => $bundled_product->get_stock_status(),
                    ),
                );
            }
        }
        
        return $items_with_details;
    }
    
    /**
     * Get is_bundle field for API
     */
    public function get_is_bundle_field($object) {
        $product = wc_get_product($object['id']);
        return $product && $product->get_type() === 'bundle';
    }
    
    /**
     * Get Arabic name field
     */
    public function get_arabic_name_field($object) {
        return get_post_meta($object['id'], '_arabic_name', true);
    }
    
    /**
     * Get Arabic description field
     */
    public function get_arabic_description_field($object) {
        return get_post_meta($object['id'], '_arabic_description', true);
    }
    
    /**
     * Get Arabic short description field
     */
    public function get_arabic_short_description_field($object) {
        return get_post_meta($object['id'], '_arabic_short_description', true);
    }
    
    /**
     * Get Arabic tags field
     */
    public function get_arabic_tags_field($object) {
        return get_post_meta($object['id'], '_arabic_tags', true);
    }
    
    /**
     * Get bundle pricing field
     */
    public function get_bundle_pricing_field($object) {
        $product = wc_get_product($object['id']);
        
        if (!$product) {
            return null;
        }
        
        // Get product prices
        $regular_price = $product->get_regular_price();
        $sale_price = $product->get_sale_price();
        $current_price = $product->get_price();
        
        // Get custom bundle prices (monthly pricing)
        $three_month_price = get_post_meta($object['id'], '_bundle_3_month_regular_price', true);
        $three_month_sale_price = get_post_meta($object['id'], '_bundle_3_month_sale_price', true);
        $six_month_price = get_post_meta($object['id'], '_bundle_6_month_regular_price', true);
        $six_month_sale_price = get_post_meta($object['id'], '_bundle_6_month_sale_price', true);
        
        // Auto-calculate if not set
        $three_regular = !empty($three_month_price) ? $three_month_price : ($regular_price * 3);
        $three_sale = !empty($three_month_sale_price) ? $three_month_sale_price : ($sale_price ? $sale_price * 3 : null);
        
        $six_regular = !empty($six_month_price) ? $six_month_price : ($regular_price * 6);
        $six_sale = !empty($six_month_sale_price) ? $six_month_sale_price : ($sale_price ? $sale_price * 6 : null);
        
        return array(
            'three_month' => array(
                'regular_price' => $three_regular ? number_format($three_regular, 2, '.', '') : null,
                'sale_price' => $three_sale ? number_format($three_sale, 2, '.', '') : null,
            ),
            'six_month' => array(
                'regular_price' => $six_regular ? number_format($six_regular, 2, '.', '') : null,
                'sale_price' => $six_sale ? number_format($six_sale, 2, '.', '') : null,
            ),
        );
    }
    
    /**
     * Add bundle data to product API response
     */
    public function add_bundle_data_to_api($response, $object, $request) {
        $product = wc_get_product($object->get_id());
        
        if ($product && $product->get_type() === 'bundle') {
            $data = $response->get_data();
            
            // Add bundle-specific information
            $data['type'] = 'bundle';
            $data['virtual_pricing'] = get_post_meta($object->get_id(), '_bundle_virtual_price', true) === 'yes';
            
            // Ensure stock status is correctly calculated based on components
            $bundle_items = get_post_meta($object->get_id(), '_bundle_items', true);
            $all_in_stock = true;
            
            if (!empty($bundle_items) && is_array($bundle_items)) {
                foreach ($bundle_items as $item) {
                    $bundled_product = wc_get_product($item['product_id']);
                    
                    if (!$bundled_product || $bundled_product->get_stock_status() === 'outofstock' || !$bundled_product->is_in_stock()) {
                        $all_in_stock = false;
                        break;
                    }
                    
                    // Check if sufficient quantity available
                    if ($bundled_product->managing_stock() && $bundled_product->get_stock_quantity() < $item['quantity']) {
                        $all_in_stock = false;
                        break;
                    }
                }
            }
            
            // Update stock status in response
            $data['stock_status'] = $all_in_stock ? 'instock' : 'outofstock';
            
            $response->set_data($data);
        }
        
        return $response;
    }
}
