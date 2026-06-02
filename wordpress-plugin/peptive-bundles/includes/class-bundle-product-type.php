<?php
/**
 * Bundle Product Type
 * Registers custom 'bundle' product type in WooCommerce
 */

if (!defined('ABSPATH')) {
    exit;
}

class Peptive_Bundle_Product_Type {
    
    public function __construct() {
        add_filter('product_type_selector', array($this, 'add_bundle_product_type'));
        add_filter('woocommerce_product_data_tabs', array($this, 'add_bundle_product_tab'), 99);
        add_action('woocommerce_product_data_panels', array($this, 'bundle_product_tab_content'));
        add_action('woocommerce_product_data_panels', array($this, 'arabic_translation_tab_content'));
        add_action('woocommerce_product_data_panels', array($this, 'bundle_pricing_tab_content'));
        add_action('woocommerce_process_product_meta', array($this, 'save_all_custom_fields'), 10, 1);
        add_action('woocommerce_process_product_meta_bundle', array($this, 'save_bundle_data'));
        add_action('woocommerce_bundle_add_to_cart', array($this, 'bundle_add_to_cart'));
        
        // Show price fields for bundle products
        add_filter('product_type_options', array($this, 'bundle_product_type_options'));
        
        // Add JavaScript to show/hide fields
        add_action('admin_footer', array($this, 'admin_script'));
    }
    
    /**
     * Add Bundle to product type dropdown
     */
    public function add_bundle_product_type($types) {
        $types['bundle'] = __('Product Bundle', 'peptive-bundles');
        return $types;
    }
    
    /**
     * Add Bundle tab to product data
     */
    public function add_bundle_product_tab($tabs) {
        // Make sure General tab shows for bundle products
        if (isset($tabs['general']['class'])) {
            $tabs['general']['class'][] = 'show_if_bundle';
        }
        
        // Make sure Inventory tab shows for bundle products
        if (isset($tabs['inventory']['class'])) {
            $tabs['inventory']['class'][] = 'show_if_bundle';
        }
        
        // Make sure Shipping tab shows for bundle products
        if (isset($tabs['shipping']['class'])) {
            $tabs['shipping']['class'][] = 'show_if_bundle';
        }
        
        // Add Bundle Products tab (only for bundle type)
        $tabs['bundle'] = array(
            'label'    => __('Bundle Products', 'peptive-bundles'),
            'target'   => 'bundle_product_data',
            'class'    => array('show_if_bundle'),
            'priority' => 11,
        );
        
        // Add Arabic Translation tab (for all product types)
        $tabs['peptive_arabic'] = array(
            'label'    => __('Arabic Translation', 'peptive-bundles'),
            'target'   => 'peptive_arabic_data',
            'class'    => array('show_if_simple', 'show_if_bundle'),
            'priority' => 12,
        );
        
        // Add Monthly Pricing tab (for simple and bundle products)
        $tabs['peptive_bundle_pricing'] = array(
            'label'    => __('Monthly Pricing', 'peptive-bundles'),
            'target'   => 'peptive_bundle_pricing_data',
            'class'    => array('show_if_simple', 'show_if_bundle'),
            'priority' => 13,
        );
        
        return $tabs;
    }
    
    /**
     * Arabic Translation tab content
     */
    public function arabic_translation_tab_content() {
        global $post;
        
        $arabic_name = get_post_meta($post->ID, '_arabic_name', true);
        $arabic_description = get_post_meta($post->ID, '_arabic_description', true);
        $arabic_short_description = get_post_meta($post->ID, '_arabic_short_description', true);
        $arabic_tags = get_post_meta($post->ID, '_arabic_tags', true);
        ?>
        <div id="peptive_arabic_data" class="panel woocommerce_options_panel">
            <div class="options_group">
                <p class="form-field">
                    <label for="arabic_name"><?php _e('Arabic Product Name', 'peptive-bundles'); ?></label>
                    <input type="text" class="short" name="arabic_name" id="arabic_name" value="<?php echo esc_attr($arabic_name); ?>" style="width: 100%;" dir="rtl">
                </p>
                
                <p class="form-field">
                    <label for="arabic_short_description"><?php _e('Arabic Short Description', 'peptive-bundles'); ?></label>
                    <textarea name="arabic_short_description" id="arabic_short_description" rows="3" style="width: 100%;" dir="rtl"><?php echo esc_textarea($arabic_short_description); ?></textarea>
                </p>
                
                <p class="form-field">
                    <label for="arabic_description"><?php _e('Arabic Description', 'peptive-bundles'); ?></label>
                    <textarea name="arabic_description" id="arabic_description" rows="6" style="width: 100%;" dir="rtl"><?php echo esc_textarea($arabic_description); ?></textarea>
                    <span class="description"><?php _e('Full product description in Arabic', 'peptive-bundles'); ?></span>
                </p>
                
                <p class="form-field">
                    <label for="arabic_tags"><?php _e('Arabic Tags (comma separated)', 'peptive-bundles'); ?></label>
                    <input type="text" class="short" name="arabic_tags" id="arabic_tags" value="<?php echo esc_attr($arabic_tags); ?>" style="width: 100%;" dir="rtl">
                    <span class="description"><?php _e('Enter tags separated by commas', 'peptive-bundles'); ?></span>
                </p>
            </div>
        </div>
        <?php
    }
    
    /**
     * Monthly Pricing tab content
     */
    public function bundle_pricing_tab_content() {
        global $post;
        
        // Get existing bundle pricing
        $three_month_price = get_post_meta($post->ID, '_bundle_3_month_regular_price', true);
        $three_month_sale_price = get_post_meta($post->ID, '_bundle_3_month_sale_price', true);
        $six_month_price = get_post_meta($post->ID, '_bundle_6_month_regular_price', true);
        $six_month_sale_price = get_post_meta($post->ID, '_bundle_6_month_sale_price', true);
        
        ?>
        <div id="peptive_bundle_pricing_data" class="panel woocommerce_options_panel">
            <div class="options_group">
                <p class="form-field">
                    <strong><?php _e('3-Month Pricing', 'peptive-bundles'); ?></strong>
                    <span class="description" style="display: block; margin-top: 5px;">
                        <?php _e('Set pricing for 3-month supply (3 units). Leave empty to auto-calculate from single unit price.', 'peptive-bundles'); ?>
                    </span>
                </p>
                
                <?php
                woocommerce_wp_text_input(array(
                    'id'                => '_bundle_3_month_regular_price',
                    'label'             => __('Regular Price (3 months)', 'peptive-bundles'),
                    'placeholder'       => __('Auto-calculated if empty', 'peptive-bundles'),
                    'desc_tip'          => true,
                    'description'       => __('Regular price for 3-month supply', 'peptive-bundles'),
                    'type'              => 'number',
                    'custom_attributes' => array(
                        'step' => '0.01',
                        'min'  => '0',
                    ),
                ));
                
                woocommerce_wp_text_input(array(
                    'id'                => '_bundle_3_month_sale_price',
                    'label'             => __('Sale Price (3 months)', 'peptive-bundles'),
                    'placeholder'       => __('Optional', 'peptive-bundles'),
                    'desc_tip'          => true,
                    'description'       => __('Sale price for 3-month supply', 'peptive-bundles'),
                    'type'              => 'number',
                    'custom_attributes' => array(
                        'step' => '0.01',
                        'min'  => '0',
                    ),
                ));
                ?>
            </div>
            
            <div class="options_group">
                <p class="form-field">
                    <strong><?php _e('6-Month Pricing', 'peptive-bundles'); ?></strong>
                    <span class="description" style="display: block; margin-top: 5px;">
                        <?php _e('Set pricing for 6-month supply (6 units). Leave empty to auto-calculate from single unit price.', 'peptive-bundles'); ?>
                    </span>
                </p>
                
                <?php
                woocommerce_wp_text_input(array(
                    'id'                => '_bundle_6_month_regular_price',
                    'label'             => __('Regular Price (6 months)', 'peptive-bundles'),
                    'placeholder'       => __('Auto-calculated if empty', 'peptive-bundles'),
                    'desc_tip'          => true,
                    'description'       => __('Regular price for 6-month supply', 'peptive-bundles'),
                    'type'              => 'number',
                    'custom_attributes' => array(
                        'step' => '0.01',
                        'min'  => '0',
                    ),
                ));
                
                woocommerce_wp_text_input(array(
                    'id'                => '_bundle_6_month_sale_price',
                    'label'             => __('Sale Price (6 months)', 'peptive-bundles'),
                    'placeholder'       => __('Optional', 'peptive-bundles'),
                    'desc_tip'          => true,
                    'description'       => __('Sale price for 6-month supply', 'peptive-bundles'),
                    'type'              => 'number',
                    'custom_attributes' => array(
                        'step' => '0.01',
                        'min'  => '0',
                    ),
                ));
                ?>
            </div>
            
            <div class="options_group">
                <p class="form-field" style="padding: 10px 12px; background: #f0f0f1; border-left: 4px solid #2271b1;">
                    <strong><?php _e('How it works:', 'peptive-bundles'); ?></strong><br>
                    <span class="description">
                        • <?php _e('If monthly prices are empty, they will be auto-calculated (unit price × quantity)', 'peptive-bundles'); ?><br>
                        • <?php _e('Set custom prices to offer monthly supply discounts', 'peptive-bundles'); ?><br>
                        • <?php _e('Sale prices override regular prices when set', 'peptive-bundles'); ?>
                    </span>
                </p>
            </div>
        </div>
        <?php
    }
    
    /**
     * Save all custom fields (Arabic translations and bundle pricing)
     */
    public function save_all_custom_fields($post_id) {
        // Save Arabic translation fields
        if (isset($_POST['arabic_name'])) {
            update_post_meta($post_id, '_arabic_name', sanitize_text_field($_POST['arabic_name']));
        }
        if (isset($_POST['arabic_description'])) {
            update_post_meta($post_id, '_arabic_description', wp_kses_post($_POST['arabic_description']));
        }
        if (isset($_POST['arabic_short_description'])) {
            update_post_meta($post_id, '_arabic_short_description', wp_kses_post($_POST['arabic_short_description']));
        }
        if (isset($_POST['arabic_tags'])) {
            update_post_meta($post_id, '_arabic_tags', sanitize_text_field($_POST['arabic_tags']));
        }
        
        // Save bundle pricing fields
        if (isset($_POST['_bundle_3_month_regular_price'])) {
            update_post_meta($post_id, '_bundle_3_month_regular_price', sanitize_text_field($_POST['_bundle_3_month_regular_price']));
        }
        if (isset($_POST['_bundle_3_month_sale_price'])) {
            update_post_meta($post_id, '_bundle_3_month_sale_price', sanitize_text_field($_POST['_bundle_3_month_sale_price']));
        }
        if (isset($_POST['_bundle_6_month_regular_price'])) {
            update_post_meta($post_id, '_bundle_6_month_regular_price', sanitize_text_field($_POST['_bundle_6_month_regular_price']));
        }
        if (isset($_POST['_bundle_6_month_sale_price'])) {
            update_post_meta($post_id, '_bundle_6_month_sale_price', sanitize_text_field($_POST['_bundle_6_month_sale_price']));
        }
    }
    
    /**
     * Bundle tab content
     */
    public function bundle_product_tab_content() {
        global $post;
        ?>
        <div id="bundle_product_data" class="panel woocommerce_options_panel">
            <div class="options_group">
                <p class="form-field">
                    <label><?php _e('Bundle Products', 'peptive-bundles'); ?></label>
                    <span class="description"><?php _e('Select products to include in this bundle', 'peptive-bundles'); ?></span>
                </p>
                
                <div id="bundle-items-container">
                    <?php
                    $bundle_items = get_post_meta($post->ID, '_bundle_items', true);
                    if (!empty($bundle_items) && is_array($bundle_items)) {
                        foreach ($bundle_items as $index => $item) {
                            $this->render_bundle_item_row($index, $item);
                        }
                    }
                    ?>
                </div>
                
                <p class="form-field">
                    <button type="button" class="button add-bundle-item"><?php _e('Add Product', 'peptive-bundles'); ?></button>
                </p>
            </div>
            
            <div class="options_group">
                <?php
                woocommerce_wp_checkbox(array(
                    'id'          => '_bundle_virtual_price',
                    'label'       => __('Virtual Pricing', 'peptive-bundles'),
                    'description' => __('Calculate price from bundled products', 'peptive-bundles'),
                    'desc_tip'    => true,
                ));
                ?>
            </div>
        </div>
        
        <script type="text/javascript">
        jQuery(function($) {
            var bundleItemIndex = <?php echo !empty($bundle_items) ? count($bundle_items) : 0; ?>;
            
            $('.add-bundle-item').on('click', function() {
                var template = $('#bundle-item-template').html();
                template = template.replace(/INDEX/g, bundleItemIndex);
                $('#bundle-items-container').append(template);
                bundleItemIndex++;
            });
            
            $(document).on('click', '.remove-bundle-item', function() {
                $(this).closest('.bundle-item-row').remove();
            });
            
            // Show/hide based on product type
            $('select#product-type').change(function() {
                if ($(this).val() == 'bundle') {
                    $('.show_if_bundle').show();
                    $('.hide_if_bundle').hide();
                    $('#general_product_data .pricing').hide();
                    $('#general_product_data ._tax_status_field').parent().hide();
                } else {
                    $('.show_if_bundle').hide();
                    $('#general_product_data .pricing').show();
                    $('#general_product_data ._tax_status_field').parent().show();
                }
            }).change();
        });
        </script>
        
        <script type="text/template" id="bundle-item-template">
            <?php $this->render_bundle_item_row('INDEX', array()); ?>
        </script>
        
        <style>
        .bundle-item-row {
            border: 1px solid #ddd;
            padding: 12px;
            margin-bottom: 10px;
            background: #f9f9f9;
            position: relative;
        }
        .bundle-item-row .remove-bundle-item {
            position: absolute;
            top: 10px;
            right: 10px;
        }
        </style>
        <?php
    }
    
    /**
     * Render bundle item row
     */
    private function render_bundle_item_row($index, $item = array()) {
        $product_id = isset($item['product_id']) ? $item['product_id'] : '';
        $quantity = isset($item['quantity']) ? $item['quantity'] : 1;
        
        // Get all products (simple, variable, and other bundle products)
        $args = array(
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
            'orderby'        => 'title',
            'order'          => 'ASC',
        );
        $products = get_posts($args);
        ?>
        <div class="bundle-item-row">
            <p class="form-field">
                <label><?php _e('Product', 'peptive-bundles'); ?></label>
                <select name="bundle_items[<?php echo $index; ?>][product_id]" class="bundle-product-select" style="width: 60%;" required>
                    <option value=""><?php _e('Select a product...', 'peptive-bundles'); ?></option>
                    <?php foreach ($products as $prod) {
                        $product_obj = wc_get_product($prod->ID);
                        if ($product_obj) {
                            $selected = ($product_id == $prod->ID) ? 'selected="selected"' : '';
                            echo '<option value="' . esc_attr($prod->ID) . '" ' . $selected . '>' . esc_html($product_obj->get_name()) . ' (#' . $prod->ID . ')</option>';
                        }
                    } ?>
                </select>
            </p>
            <p class="form-field">
                <label><?php _e('Quantity', 'peptive-bundles'); ?></label>
                <input type="number" name="bundle_items[<?php echo $index; ?>][quantity]" value="<?php echo esc_attr($quantity); ?>" min="1" step="1" style="width: 100px;">
            </p>
            <button type="button" class="button remove-bundle-item"><?php _e('Remove', 'peptive-bundles'); ?></button>
        </div>
        <?php
    }
    
    /**
     * Save bundle data
     */
    public function save_bundle_data($post_id) {
        $bundle_items = isset($_POST['bundle_items']) ? $_POST['bundle_items'] : array();
        
        // Clean and validate bundle items
        $clean_items = array();
        foreach ($bundle_items as $item) {
            if (!empty($item['product_id']) && !empty($item['quantity'])) {
                $clean_items[] = array(
                    'product_id' => absint($item['product_id']),
                    'quantity'   => absint($item['quantity']),
                );
            }
        }
        
        update_post_meta($post_id, '_bundle_items', $clean_items);
        update_post_meta($post_id, '_bundle_virtual_price', isset($_POST['_bundle_virtual_price']) ? 'yes' : 'no');
        
        // Calculate price if virtual pricing is enabled
        if (isset($_POST['_bundle_virtual_price']) && $_POST['_bundle_virtual_price'] === 'yes') {
            $total_price = 0;
            foreach ($clean_items as $item) {
                $product = wc_get_product($item['product_id']);
                if ($product) {
                    $total_price += $product->get_price() * $item['quantity'];
                }
            }
            update_post_meta($post_id, '_regular_price', $total_price);
            update_post_meta($post_id, '_price', $total_price);
        }
    }
    
    /**
     * Bundle add to cart template
     */
    public function bundle_add_to_cart() {
        wc_get_template('single-product/add-to-cart/simple.php');
    }
    
    /**
     * Enable product type options for bundle
     */
    public function bundle_product_type_options($options) {
        foreach ($options as $key => $option) {
            $options[$key]['wrapper_class'] .= ' show_if_bundle';
        }
        return $options;
    }
    
    /**
     * Add admin script to show/hide fields
     */
    public function admin_script() {
        global $post, $pagenow;
        
        if (($pagenow === 'post.php' || $pagenow === 'post-new.php') && isset($post->post_type) && $post->post_type === 'product') {
            ?>
            <script type="text/javascript">
            jQuery(function($) {
                // Show pricing fields for bundle products
                $('#product-type').on('change', function() {
                    if ($(this).val() === 'bundle') {
                        $('.show_if_simple').show();
                        $('.show_if_bundle').show();
                        $('.pricing').show();
                        $('.options_group.pricing').show();
                        $('._regular_price_field').show();
                        $('._sale_price_field').show();
                        $('._tax_status_field').parent().show();
                        $('._tax_class_field').parent().show();
                    }
                }).trigger('change');
            });
            </script>
            <?php
        }
    }
}
