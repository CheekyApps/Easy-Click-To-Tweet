(function() {

    /**
     * Maximum allowed characters
     */
    var maxLength = 140;

    /**
     * List of available styles.
     * <span class="text-wrap"></span> - is a required element in a template
     */
    var themes = {
        'basic-white': {
            title: 'Basic White Skin',
            pro: false,
            template: '<div class="click-to-tweet ctt-theme-basic-white">\
                <a href="#" class="tweet-link">\
                    <span class="text-wrap"></span>\
                    <span class="ctt-cta">Click to Tweet</span>\
                </a>\
            </div>'
        },
        'basic-full': {
            title: 'Basic Full Skin',
            pro: false,
            template: '<div class="click-to-tweet ctt-theme-basic-full">\
                <a href="#" class="tweet-link">\
                    <span class="text-wrap"></span>\
                    <span class="ctt-cta"><i class="bird-icon"></i>Click to Tweet</span>\
                </a>\
            </div>'
        },
        'basic-border': {
            title: 'Basic Border',
            pro: false,
            template: '<div class="click-to-tweet ctt-theme-basic-border">\
                <a href="#" class="tweet-link">\
                    <span class="text-wrap"></span>\
                    <span class="ctt-cta"><i class="bird-icon"></i> Click to Tweet</span>\
                </a>\
            </div>'
        },
        'tweet-block-light-red': {
            title: 'Tweet Block - Light Red - Pro Only',
            pro: true,
            template: '<div class="click-to-tweet ctt-theme-tweet-block-light-red">\
                <a href="#" class="tweet-link" target="_blank">\
                    <span class="text-wrap"></span>\
                    <span class="ctt-cta"><i class="bird-icon"></i> Click to Tweet</span>\
                </a>\
            </div>'
        },
        'tweet-block-orange': {
            title: 'Tweet Block - Orange - Pro Only',
            pro: true,
            template: '<div class="click-to-tweet ctt-theme-tweet-block-orange">\
                <a href="#" class="tweet-link">\
                    <span class="text-wrap"></span>\
                    <span class="ctt-cta"><i class="bird-icon"></i> Click to Tweet</span>\
                </a>\
            </div>'
        },
        'tweet-block-violet': {
            title: 'Tweet Block - Violet - Pro Only',
            pro: true,
            template: '<div class="click-to-tweet ctt-theme-tweet-block-violet">\
                <a href="#" class="tweet-link">\
                    <span class="text-wrap"></span>\
                    <span class="ctt-cta"><i class="bird-icon"></i> Click to Tweet</span>\
                </a>\
            </div>'
        },
        'highlight-tweet': {
            title: 'Highlight To Tweet -  Pro Only',
            pro: true,
            template: '<span class="click-to-tweet ctt-theme-tweet-block-light-red">\
                <a href="#" class="tweet-link"><span class="text-wrap"></span></a>\
            </span>'
        }
    };

    var themesSelect = [];
    for( var theme in themes ){
        var item = { text: themes[theme].title, value: theme };
        themesSelect.push(item);
    }

    tinymce.create('tinymce.plugins.CAClickToTweet', {
        init: function(ed, url) {

            jQuery('<link/>', {href: CAClickToTweet.url + '/assets/css/ca_click_to_tweet.css', rel: 'stylesheet'}).appendTo('head');

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
            var $previewContainer; // jQuery Element of the preview container
            var $previewText; // jQuery Element for the tweet text
            var $counter = jQuery('<span/>', { "class": "click-to-tweet-counter" });
            var $counterContainer = jQuery('<div class="click-to-tweet-counter-container"> / '+maxLength+' Characters</div>').prepend($counter);
            var currentTheme = '';

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

            var setupStyleContainer = function(themeName){
                if( currentTheme === themeName ){
                    return;
                }
                if(!themeName){
                    themeName = themesSelect[0].value;
                }
                currentTheme = themeName;
                if( typeof $previewContainer !== 'undefined'){
                    $previewContainer.remove();
                }
                $previewContainer = jQuery( themes[themeName].template );
                $previewText = $previewContainer.find('.text-wrap');
                $previewContainer.append( $counterContainer);
                $body.append( $previewContainer );
                updatePreview();
                updateCounter();
            }

            /**
             * Update the counter element with the number of entered tweet characters
             */
            var updateCounter = function(){
                var len = $input.val().length;
                $counter.html( len );
                // maximum allowed characters exceeded?
                setDanger( len > maxLength || themes[currentTheme].pro );
            };

            var setDanger = function(isDanger){
                 $body[ isDanger? 'addClass': 'removeClass' ]('danger');
            }

            ed.addButton('ca-clicktotweet', {
                title: CAClickToTweet.button_title,
                image: CAClickToTweet.url + '/assets/img/twitter-little-bird-button.png',
                onclick: function() {
                    /**
                     * Setup element references after popup is opened.
                     */
                    var initPreview = function(e){
                        initPreview = function(){}; /* make this function only runs once after popup is opened */
                        $body = jQuery('.mce-container.mce-panel.mce-floatpanel.mce-window .mce-window-body');
                        $input = $body.find('.mce-textbox.mce-abs-layout-item');
                    };


                    var attemptInitPreview = function(){
                        if(jQuery('.mce-container.mce-panel.mce-floatpanel.mce-window .mce-window-body').length) {
                            initPreview();
                            setupStyleContainer();
                            $input.val('Enter your tweet here').select();
                            updatePreview();
                            updateCounter();
                        } else {
                            setTimeout(attemptInitPreview, 50);
                        }
                    };
                    attemptInitPreview();

                    ed.windowManager.open({
                        title: 'Easy Click To Tweet Boxes',
                        width: 700,
                        minHeight: 240,
                        body: [
                            {
                                type   : 'textbox',
                                name   : 'message',
                                label  : 'Tweet text',
                                minHeight: '50px',
                                onkeyup: function(e){
                                    updatePreview();
                                    updateCounter();
                                }
                            }, {
                                type   : 'listbox',
                                name   : 'theme',
                                label  : 'Tweet Box Style',
                                values : themesSelect,
                                onselect: function(e){
                                    setupStyleContainer(this.value());
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

