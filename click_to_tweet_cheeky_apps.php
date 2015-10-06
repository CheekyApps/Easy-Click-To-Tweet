<?php
/*
	Plugin Name: Easy Click to Tweet Boxes by Cheeky Apps
	Plugin URI: http://cheekyapps.com/easy-to-tweet-waiting-list/
	Description: Create Beautiful Tweet Boxes in Less Than 5 Minutes with Easy Click to Tweet by Cheeky Apps. Similar to "Tweet This", you'll be able to drive more social media traffic to your website & Give your readers a better way to engage with your content. No Coding Required.
	Author: Scott Moses
	Version: 1.0
	Author URI: https://CheekyApps.com
*/

if ( ! defined('ABSPATH')){
	exit;
}

require_once ( plugin_dir_path(__FILE__) . 'ca_sidebar_menu.php' );
require_once ( plugin_dir_path(__FILE__) . 'tweet-button.php' );
require_once ( plugin_dir_path(__FILE__) . 'ca_shortcode.php' );
