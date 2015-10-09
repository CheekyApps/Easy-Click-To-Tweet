(function() {

    /**
     * Maximum allowed characters
     */
    var maxLength = 140;

    /**
     * List of available styles.
     * The value is used for the tweet class, e.g.: .click-to-tweet.ctt-theme-basic-white
     */
    var previewStyles = [
        { text: 'Basic White Skin', value: 'basic-white', selected: true },
        { text: 'Basic Full Skin', value: 'basic-full' },
        { text: 'Basic Border', value: 'basic-border' }
    ];

    tinymce.create('tinymce.plugins.CAClickToTweet', {
        init: function(ed, url) {
            console.log( url );

            jQuery('<link/>', {href: '../wp-content/plugins/Easy-Click-To-Tweet/assets/css/ca_click_to_tweet.css', rel: 'stylesheet'}).appendTo('head');

            /**
             *   Definitions:
             *   $body - popup body
             *       $previewContainer - div.click-to-tweet.ctt-theme-basic-white - the preview container
             *           $previewText - a.tweet-link - preview text
             *           $counterContainer - div.click-to-tweet-counter-container
             *               $counter - span.click-to-tweet-counter - number of characters text
             * 
             */

            var $body; // popup body
            var $input; // tweet input
            var $previewContainer = jQuery('<div/>', { "class":"click-to-tweet ctt-theme-basic-white" });
            var $previewText = jQuery('<a/>', { "class": "tweet-link" });
            var $counter = jQuery('<span/>', { "class": "click-to-tweet-counter" });
            var $counterContainer = jQuery('<div class="click-to-tweet-counter-container"> / '+maxLength+' Characters</div>').prepend($counter);
            $previewContainer.append( $previewText, $counterContainer);

            /**
             * Update the preview text
             */
            var updatePreview = function(){
                var text = jQuery.trim( $input.val() );
                if( !text ){
                    text = "&nbsp;";
                }
                $previewText.html( text );
            };

            /**
             * Update the counter element with the number of entered tweet characters
             */
            var updateCounter = function(){
                var len = $input.val().length;
                $counter.html( len );
                // maximum allowed characters exceeded?
                (len > maxLength)? $body.addClass('danger') : $body.removeClass('danger');
            };


            ed.addButton('ca-clicktotweet', {
                title: CAClickToTweet.button_title,
                image: CAClickToTweet.url + '/assets/img/twitter-little-bird-button.png',
                onclick: function() {
                    /**
                     * Setup element references after popup is opened.
                     */
                    var initPreview = function(e){
                        initPreview = function(){}; /* make this function only runs once after popup is opened */
                        $input = jQuery(e.target);
                        $body = $input.closest('.mce-window-body');
                        $body.append( $previewContainer );
                    };

                    ed.windowManager.open({
                        title: 'Easy Click To Tweet Boxes',
                        width: 700,
                        minHeight: 300,
                        body: [
                            {
                                type   : 'textbox',
                                name   : 'message',
                                label  : 'Tweet text',
                                minHeight: '50px',
                                onkeyup: function(e){
                                    initPreview(e);
                                    updatePreview();
                                    updateCounter();
                                }
                            }, {
                                type   : 'listbox',
                                name   : 'theme',
                                label  : 'Tweet Box Style',
                                values : previewStyles,
                                onselect: function(e){
                                    $previewContainer.removeClass (function (index, css) {
                                        return (css.match (/(^|\s)ctt-theme-\S+/g) || []).join(' ');
                                    });
                                    $previewContainer.addClass( "ctt-theme-"+ this.value() );
                                }
                            }
                        ],
                        onsubmit: function(e) {
                            var tweet = '[Tweet';
                            //Change paramater here for an new listbox, ie copy and past & change theme 
                            if ( e.data.theme ) {
                                tweet += ' theme="' + e.data.theme + '"';
                            };

                            tweet += ']' + e.data.message + '[/Tweet]';
                            ed.focus();
                            console.log( e.data );
                            ed.selection.setContent( tweet );
                        }
                    });
                    // var m = prompt("Click To Tweet", "Enter your tweets");
                    // if (m != null && m != 'undefined' && m != 'Enter your tweets' && m != '') ed.execCommand('mceInsertContent', false, '[Tweet]' + m + '[/Tweet]');
                }
            });
        },
        createControl: function(n, cm) {
            return null;
        },
        getInfo: function() {
            return {
                longname: "Easy Click To Tweet Boxes",
                author: 'CheekyApps',
                authorurl: 'http://CheeyApps.com/',
                infourl: 'http://CheekyApps.com/click-to-tweet-plugin',
                version: "1.0"
            };
        }
    });
//


    tinymce.PluginManager.add('caclicktotweet', tinymce.plugins.CAClickToTweet);
})();

