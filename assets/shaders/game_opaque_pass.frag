#version 330 core
#extension GL_ARB_explicit_uniform_location : require

layout(location = 1) uniform vec4 features;

layout(location = 2) uniform sampler2D albedo_map;
layout(location = 3) uniform vec4 albedo_factor;

layout(location = 4) uniform sampler2D emissive_map;
layout(location = 5) uniform vec3 emissive_factor;

layout(location = 6) uniform float alpha_cutoff;

in vec2 vp_texcoords;
in vec4 vp_color;
in vec3 vp_normal;
in float vp_z;

layout(location = 0) out vec4 out_color;
layout(location = 1) out vec4 out_emissive;
layout(location = 2) out vec4 out_depth_nrm;

void main()
{
    vec4 albedo_map_sample = texture(albedo_map, vp_texcoords);
    albedo_map_sample = mix(vec4(1.0), albedo_map_sample, features.x);

    if(features.z > 0.5) {
        if(albedo_map_sample.a < alpha_cutoff) {
            discard;
        }

        albedo_map_sample.a = 1.0;
    }

    vec4 albedo = albedo_map_sample * vp_color * albedo_factor;

    if(albedo.a < 0.99999f) {
        discard;
    }

    vec3 emissive_map_sample = texture(emissive_map, vp_texcoords).rgb;
    emissive_map_sample = mix(vec3(1.0), emissive_map_sample, features.y);
    vec3 emissive = emissive_map_sample * emissive_factor;

    out_color = albedo;
    out_emissive = vec4(emissive, albedo.a);
    out_depth_nrm = vec4(normalize(vp_normal), vp_z);
}