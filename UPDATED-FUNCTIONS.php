<?php
/**
 * ==================== CORS CONFIGURATION FOR HEADLESS NEXT.JS ====================
 * This allows your Next.js frontend to communicate with WordPress REST API
 */

add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    
    add_filter('rest_pre_serve_request', function($value) {
        $origin = get_http_origin();
        
        $allowed_origins = [
            'http://localhost:3000',
            'https://peptive.vercel.app',
            'https://www.peptive.vercel.app'
        ];
        
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WC-Store-API-Nonce');
            header('Vary: Origin');
        }
        
        // Handle OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }
        
        return $value;
    });
}, 15);

/**
 * ==================== EARLY CORS HEADERS (FOR ALL REQUESTS) ====================
 * Apply CORS headers before WordPress REST API initialization
 * This ensures Store API endpoints get proper headers
 */
add_action('init', function() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    $allowed_origins = [
        'http://localhost:3000',
        'https://peptive.vercel.app',
        'https://www.peptive.vercel.app'
    ];
    
    if (in_array($origin, $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WC-Store-API-Nonce, X-Requested-With');
        header('Vary: Origin');
        
        // Handle preflight OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }
    }
});

/**
 * ==================== WOOCOMMERCE STORE API NONCE FILTER ====================
 * Allow Store API access from external origins
 */
add_filter('woocommerce_store_api_disable_nonce_check', function() {
    return true; // Only for headless setups
});

/**
 * ==================== USER REGISTRATION ENDPOINT ====================
 * Custom endpoint for user registration from Next.js
 */
add_action('rest_api_init', function() {
    register_rest_route('wp/v2', '/users/register', array(
        'methods' => 'POST',
        'callback' => 'custom_user_registration',
        'permission_callback' => '__return_true'
    ));
});

function custom_user_registration($request) {
    $username = sanitize_user($request['username']);
    $email = sanitize_email($request['email']);
    $password = $request['password'];
    $first_name = sanitize_text_field($request['first_name'] ?? '');
    $last_name = sanitize_text_field($request['last_name'] ?? '');
  
    // Validate required fields
    if (empty($username) || empty($email) || empty($password)) {
        return new WP_Error('missing_fields', 'Required fields are missing', array('status' => 400));
    }
  
    if (username_exists($username)) {
        return new WP_Error('username_exists', 'Username already exists', array('status' => 400));
    }
  
    if (email_exists($email)) {
        return new WP_Error('email_exists', 'Email already exists', array('status' => 400));
    }
  
    // Create user
    $user_id = wp_create_user($username, $password, $email);
  
    if (is_wp_error($user_id)) {
        return $user_id;
    }
  
    // Add user meta
    if (!empty($first_name)) {
        update_user_meta($user_id, 'first_name', $first_name);
    }
    if (!empty($last_name)) {
        update_user_meta($user_id, 'last_name', $last_name);
    }
  
    // Set role to customer
    wp_update_user(array(
        'ID' => $user_id,
        'role' => 'customer'
    ));
  
    return array(
        'success' => true,
        'user_id' => $user_id,
        'message' => 'User registered successfully'
    );
}
