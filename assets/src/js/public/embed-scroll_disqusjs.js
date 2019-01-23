/**
 * Disqus variables.
 */
var disqus_url = embedVars.disqusUrl;
var disqus_identifier = embedVars.disqusIdentifier;
var disqus_container_id = 'disqus_thread';
var disqus_shortname = embedVars.disqusShortname;
var disqus_title = embedVars.disqusTitle;
var disqus_config_custom = window.disqus_config;
var disqus_loaded = false;
var disqusjs_loading = false;
var current_url = window.location.href;
var disqus_div = document.getElementById( 'disqus_thread' );
var disqus_config = function () {
    /**
     * All currently supported events:
     * onReady: fires when everything is ready,
     * onNewComment: fires when a new comment is posted,
     * onIdentify: fires when user is authenticated
     */
    var dsqConfig = embedVars.disqusConfig;
    this.page.integration = dsqConfig.integration;
    this.page.remote_auth_s3 = dsqConfig.remote_auth_s3;
    this.page.api_key = dsqConfig.api_key;
    this.sso = dsqConfig.sso;
    this.language = dsqConfig.language;

    if ( disqus_config_custom ) {
        disqus_config_custom.call( this );
    }
};

/**
 * Get and set the Disqus comments embed.
 *
 * Get the Disqus comments iframe through ajax
 * and append it to the comments section.
 *
 * @since 11.0.0
 */

var retry_loading_disqusjs = function() {
    document.getElementById( 'dcl_btn_container' ).innerHTML = dclCustomVars.dcl_progress_text;
    disqusjs_loading=false;
    disqus_comments();
}

var timeout_detect = function() {
    if(typeof DisqusJS !== 'function' && document.getElementById( 'dcl_btn_container' ) !== null){
        document.getElementById( 'dcl_btn_container' ).innerHTML = '加载失败 点击 <a id="dcl_reload_disqusjs" style="cursor: pointer">此处</a> 重载';
        document.getElementById( 'dcl_reload_disqusjs' ).addEventListener('click', retry_loading_disqusjs);
    }
}

var load_disqusjs = function () {
    if ( !disqus_loaded ) {
        disqus_loaded = true;
	    var dsqjs = new DisqusJS({
            shortname: countVars.disqusShortname,
            siteName: dclCustomVars.disqusSitename,
            identifier: embedVars.disqusIdentifier,
            url: window.location.href,
            api: dclCustomVars.disqusProxyURL,
            apikey: dclCustomVars.disqusAPIKey,
            admin: dclCustomVars.disqusModerator,
            adminLabel: dclCustomVars.disqusModLabel
        });
	    if ( document.getElementById( 'dcl_btn_container' ) !== null ) {
            document.getElementById( 'dcl_btn_container' ).style.display = 'none';
        }
    }
};

var disqus_comments = function () {
    if ( !disqusjs_loading ) {
	    disqusjs_loading = true;
        var disqusjs = document.createElement( 'script' );
        disqusjs.type = 'text/javascript';
        disqusjs.async = true;
        disqusjs.src = "https://cdn.jsdelivr.net/npm/disqusjs@1.1.0/dist/disqus.js";
        disqusjs.onload = load_disqusjs;
        document.getElementById('disqus_thread').appendChild(disqusjs);
        setTimeout(timeout_detect, 5000);
    }
};

/**
 * Load Disqus comments on page scroll.
 *
 * Load Disqus comments when visitor scrolls down to the comments
 * area of the page/post.
 *
 * @since 11.0.0
 */
var djs_style = document.createElement( 'link' );
djs_style.rel = 'stylesheet';
djs_style.type = 'text/css';
djs_style.href = 'https://cdn.jsdelivr.net/npm/disqusjs@1.1/dist/disqusjs.css';
(document.getElementsByTagName( 'head' )[0] || document.getElementsByTagName( 'body' )[0]).appendChild( djs_style );

var tmp_text = document.createTextNode( dclCustomVars.dcl_progress_text ),
    tmp_div = document.createElement( 'div' );
tmp_div.setAttribute( 'id', 'dcl_btn_container' );
tmp_div.appendChild(tmp_text);

if ( current_url.indexOf( '#comment' ) != -1 ) {
    // Load directly if trying to scroll to a comment.
    disqus_comments();
} else if ( document.body.scrollHeight < window.innerHeight ) {
    // If no scroll bar found, load comments.
    disqus_comments();
} else if ( document.getElementById( 'disqus_thread' ) !== null ) {
    // Start loading the comments when user scroll down.
    window.onscroll = function () {
        if ( ( window.scrollY + window.innerHeight ) >= disqus_div.offsetTop ) {
            disqus_comments();
        }
    };
}
