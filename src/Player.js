Dash.player = function (videoElement, detailsElement) {

    var initializeStreaming = function (mpdModel) {
            var videoStreamingManager = Dash.streaming.StreamingManager(mpdModel, {
                    mediaType: 'video',
                    initType: 'quality',
                    value: 360
                }),
                audioStreamingManager = Dash.streaming.StreamingManager(mpdModel, {
                    mediaType: 'audio',
                    initType: 'bandwidth',
                    value: 0
                }),
                videoRepresentationManager = videoStreamingManager.getRepresentationManager(),
                mediaSource,
                url;

            if (window.MediaSource) {
                mediaSource = new window.MediaSource();
            } else {
                console.log("MediaSource is not available");
                return;
            }

            url = URL.createObjectURL(mediaSource);

            videoElement.pause();
            videoElement.src = url;
            videoElement.width = videoRepresentationManager.getCurrentRepresentation().getWidth();
            videoElement.height = videoRepresentationManager.getCurrentRepresentation().getHeight();

            mediaSource.addEventListener('sourceopen', function () {
                videoStreamingManager.initializeStreaming(mediaSource);
                audioStreamingManager.initializeStreaming(mediaSource);

                videoStreamingManager.startStreaming();
                audioStreamingManager.startStreaming();
            }, false);
        },

        onSuccessMpdDownloadCallback = function (request, loadedBytes, requestDuration) {
            var mpdModel = Dash.mpd.Parser(request.responseText).generateModel();

            if (typeof mpdModel === 'undefined') {
                console.log('MPD is not loaded');
            } else {
                initializeStreaming(mpdModel);
            }
        };


    return {
        load: function (url, isYouTube) {
            Dash.mpd.Downloader(url, isYouTube, onSuccessMpdDownloadCallback).downloadMpdFile();
        },

        play: function (playingMode) {
            if (typeof mpdModel === 'undefined') {
                console.log('MPD is not loaded');
            } else {
            }
        }
    };
};
