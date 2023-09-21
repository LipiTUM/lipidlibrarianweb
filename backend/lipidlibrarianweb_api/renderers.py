from rest_framework import renderers


# https://stackoverflow.com/a/61075310 CC BY-SA 4.0
class PNGRenderer(renderers.BaseRenderer):
    media_type = 'image/png'
    format = 'png'
    charset = None
    render_style = 'binary'

    def render(self, data, media_type=None, renderer_context=None):
        return data


# https://stackoverflow.com/a/61075310 CC BY-SA 4.0
class MP3Renderer(renderers.BaseRenderer):
    media_type = 'audio/mpeg'
    format = 'mp3'
    charset = None
    render_style = 'binary'

    def render(self, data, media_type=None, renderer_context=None):
        return data
