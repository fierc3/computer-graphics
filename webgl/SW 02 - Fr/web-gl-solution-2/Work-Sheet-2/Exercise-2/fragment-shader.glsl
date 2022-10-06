precision mediump float;

varying vec4 vColor;  // set in vertexshader
uniform vec4 uColor;  // Input that can be set in JS, is the "standard" for all fragments in this object
void main ()
{
    gl_FragColor = vColor;
}
