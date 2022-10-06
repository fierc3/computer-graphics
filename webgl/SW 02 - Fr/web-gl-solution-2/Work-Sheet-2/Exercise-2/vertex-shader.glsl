attribute vec2 aVertexPosition;
attribute vec4 aColor;

varying vec4 vColor;  // varying --> will be carried over to fragment shader
void main ()
{
    gl_Position = vec4 (aVertexPosition, 0, 1); //position of vertex --> Mostly defined by V2 aVertexPosition in JS
    vColor = aColor;
}
