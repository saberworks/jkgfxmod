#version 330 core
#extension GL_ARB_explicit_uniform_location : require

layout(location = 1) uniform sampler2D tex;

in vec2 vp_texcoords;
in vec4 vp_color;

layout(location = 0) out vec4 out_color;

void main()
{
    vec4 tex_color = texture(tex, vp_texcoords);
    vec4 albedo = tex_color * vp_color;

    out_color = albedo;
}