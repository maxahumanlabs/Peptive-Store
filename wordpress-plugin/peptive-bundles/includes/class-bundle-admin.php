<?php
/**
 * Bundle Admin
 * Admin interface customizations
 */

if (!defined('ABSPATH')) {
    exit;
}

class Peptive_Bundle_Admin {
    
    public function __construct() {
        add_action('admin_enqueue_scripts', array($this, 'admin_scripts'));
    }
    
    /**
     * Enqueue admin scripts
     */
    public function admin_scripts($hook) {
        if ('post.php' === $hook || 'post-new.php' === $hook) {
            global $post;
            if ($post && $post->post_type === 'product') {
                // Enqueue WooCommerce product search
                wp_enqueue_script('wc-enhanced-select');
                wp_enqueue_style('woocommerce_admin_styles');
            }
        }
    }
}
