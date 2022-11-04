class SolidCube
{
    constructor (gl)
    {
        const A = [-0.5, -0.5, -0.5], E = [-0.5, -0.5,  0.5];
        const B = [ 0.5, -0.5, -0.5], F = [ 0.5, -0.5,  0.5];
        const C = [ 0.5,  0.5, -0.5], G = [ 0.5,  0.5,  0.5];
        const D = [-0.5,  0.5, -0.5], H = [-0.5,  0.5,  0.5];

        const color1 = [1.0, 0.0, 0.0];
        const color2 = [1.0, 1.0, 0.0];
        const color3 = [0.0, 1.0, 0.0];
        const color4 = [0.0, 1.0, 1.0];
        const color5 = [0.0, 0.0, 1.0]
        const color6 = [1.0, 0.0, 1.0];

        /*
        var vertices =
        [
            ...A, ...color1, ...D, ...color1, ...C, ...color1, ...B, ...color1,
            ...A, ...color2, ...B, ...color2, ...F, ...color2, ...E, ...color2,
            ...B, ...color3, ...C, ...color3, ...G, ...color3, ...F, ...color3,
            ...C, ...color4, ...D, ...color4, ...H, ...color4, ...G, ...color4,
            ...D, ...color5, ...A, ...color5, ...E, ...color5, ...H, ...color5,
            ...E, ...color6, ...F, ...color6, ...G, ...color6, ...H, ...color6
        ];
         */

        var vertices =
            [
                ...A, ...D, ...C, ...B,
                ...A, ...B, ...F, ...E,
                ...B, ...C, ...G, ...F,
                ...C, ...D, ...H, ...G,
                ...D, ...A, ...E, ...H,
                ...E, ...F, ...G, ...H
            ];

        var colors =
            [
                ...color1, ...color1, ...color1, ...color1,
                ...color2, ...color2, ...color2, ...color2,
                ...color3, ...color3, ...color3, ...color3,
                ...color4, ...color4, ...color4, ...color4,
                ...color5, ...color5, ...color5, ...color5,
                ...color6, ...color6, ...color6, ...color6
            ];

        console.log(vertices)

        this.VertexBuffer = gl.createBuffer();

        gl.bindBuffer (gl.ARRAY_BUFFER, this.VertexBuffer);
        gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (vertices), gl.STATIC_DRAW);


        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer (gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (colors), gl.STATIC_DRAW);

        var indices =
        [
             0,  1,  2,      0,  2,  3,     //  ADCB
             4,  5,  6,      4,  6,  7,     //  ABFE
             8,  9, 10,      8, 10, 11,     //  BCGF
            12, 13, 14,     12, 14, 15,     //  CDHG
            16, 17, 18,     16, 18, 19,     //  DAEH
            20, 21, 22,     20, 22, 23      //  EFGH
        ];

        this.NumIndices = indices.length;
        this.IndexBuffer = gl.createBuffer();
        gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
        gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Int8Array (indices), gl.STATIC_DRAW);
    }


    draw (gl, ctx)
    {
        gl.bindBuffer (gl.ARRAY_BUFFER, this.VertexBuffer);
        gl.vertexAttribPointer (ctx.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray (ctx.aVertexPositionId);


        gl.bindBuffer (gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer (ctx.aColorId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray (ctx.aColorId);

        /*
        gl.bindBuffer (gl.ARRAY_BUFFER, rectangleObject.colorBuffer);
        gl.vertexAttribPointer (ctx.aColorId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray (ctx.aColorId);
         */

        gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
        gl.drawElements (gl.TRIANGLES, this.NumIndices, gl.UNSIGNED_BYTE, 0);
    }
}
