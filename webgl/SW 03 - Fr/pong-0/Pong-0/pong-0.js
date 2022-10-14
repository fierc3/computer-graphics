// Computer Graphics
// WebGL Exercises
// Pong


// Register function to call after document has loaded

window.onload = startup;


// the gl object is saved globally

var gl;


// we keep all local parameters for the program in a single object

var ctx =
{
    shaderProgram: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uProjectionMatId: -1,
    uModelMatId: -1
};


// we keep all the parameters for drawing a specific object together

var rectangleObject =
{
    buffer: -1
};

var positions = {
    leftPlayer: [-280,-10],
    rightPlayer: [280,200],
    ball: [0,0]
}

var scales = {
    players : [0.1, 0.5],
    ball: [0.1,0.1]
}

const animationFrame = (timeStamp) => {
    //console.log(timeStamp);

    // update display of frame
    draw();

    //request next frame
    requestAnimationFrame(animationFrame)
}

/**
 * Startup function to be called when the body is loaded
 */

function startup ()
{
    "use strict";
    var canvas = document.getElementById ("myCanvas");
    gl = createGLContext (canvas);
    initGL();
    window.addEventListener ('keyup', onKeyup, false);
    window.addEventListener ('keydown', onKeydown, false);
    draw();
    window.requestAnimationFrame(animationFrame)
}


/**
 * InitGL should contain the functionality that needs to be executed only once
 */

function initGL ()
{
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders (gl, 'vertex-shader.glsl', 'fragment-shader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();

    gl.clearColor (0.1, 0.1, 0.1, 1.0);

}


/**
 * Setup all the attribute and uniform variables
 */

function setUpAttributesAndUniforms ()
{
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation (ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation (ctx.shaderProgram, "uColor");
    ctx.uProjectionMatId = gl.getUniformLocation (ctx.shaderProgram, "uProjectionMat");
    ctx.uModelMatId = gl.getUniformLocation (ctx.shaderProgram, "uModelMat");

    // Set up the projection matrix
    var projectionMat = mat3.create();
    mat3.fromScaling (projectionMat,
        [2.0 / gl.drawingBufferWidth , 2.0 / gl.drawingBufferHeight]);
    gl.uniformMatrix3fv (ctx.uProjectionMatId, false, projectionMat);

    // Set up the world coordinates
    var modelMat = mat3.create();
    mat3.identity (modelMat);
    gl.uniformMatrix3fv (ctx.uModelMatId, false, modelMat);
}


/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */

function setUpBuffers ()
{
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    var vertices =
    [
        -100, -100,
         100, -100,
         100,  100,
        -100,  100
    ];
    gl.bindBuffer (gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (vertices), gl.STATIC_DRAW);
}


const drawRectangle = (mTarget) => {
    gl.uniformMatrix3fv (ctx.uModelMatId, false, mTarget);
    gl.uniform4f (ctx.uColorId, 1.0, 0.0, 0.6, 1.0);
    gl.drawArrays (gl.TRIANGLE_FAN, 0, 4);

}

var ballDirection = [-20,0]

const updateBallPosition = () => {
    const players = [positions.leftPlayer, positions.rightPlayer];
    let collision = false;
    players.forEach(x =>
    {
        if(collision) return;
        console.log('p',x)
        const playerWidth = scales.players[0] * 100;
        const playerHeight = 100;

        const bottom = x[1] - playerHeight / 2;
        const top = bottom + playerHeight;

        const left = x[0];
        const right = left + playerWidth;

        if(positions.ball[1] * scales.ball[1] <= top && positions.ball[1]* scales.ball[1] >= bottom){
            console.log('ball is same height as paddle')
            if(positions.ball[0] * scales.ball[0]  <= right && positions.ball[0] * scales.ball[0] >= left){
                console.log('xxxxxxxxxxxxxx -hit!')
                ballDirection[1] = 0
                ballDirection[0] = ballDirection[0] * -1.05;
                const yInfluence = (x[1] - positions.ball[1] * scales.ball[1] )* -0.2;
                console.log(yInfluence)
                ballDirection[1] = ballDirection[1] + yInfluence
                positions.ball = [positions.ball[0]+ballDirection[0],positions.ball[1]+ballDirection[1]]
                collision = true;
                return;
            }
        }
    });
    if(!collision){
        positions.ball = [positions.ball[0]+ballDirection[0],positions.ball[1]+ballDirection[1]]
    }
}

const updatePlayer1Position = () => {

    if(isDown(key.W)){
        console.log('up being presed')
        positions.leftPlayer = [positions.leftPlayer[0],positions.leftPlayer[1]+3]
    }else if(isDown(key.S)){
        positions.leftPlayer = [positions.leftPlayer[0],positions.leftPlayer[1]-3]
    }
}

const updatePlayer2Position = () => {

    if(isDown(key.UP)){
        console.log('up p2 being presed')
        positions.rightPlayer = [positions.rightPlayer[0],positions.rightPlayer[1]+3]
    }else if(isDown(key.DOWN)){
        positions.rightPlayer = [positions.rightPlayer[0],positions.rightPlayer[1]-3]
    }
}

/**
 * Draw the scene.
 */

function draw ()
{
    "use strict";
    console.log ("Drawing");
    gl.clear (gl.COLOR_BUFFER_BIT);

    gl.bindBuffer (gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer (ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray (ctx.aVertexPositionId);

    var m0 = mat3.create();
    mat3.identity (m0);

    updatePlayer2Position();
    updatePlayer1Position();
    updateBallPosition();

    var mLeftPlayer = mat3.create();
    mat3.translate(mLeftPlayer, m0, positions.leftPlayer);
    mat3.scale(mLeftPlayer, mLeftPlayer, scales.players)
    drawRectangle(mLeftPlayer);

    var mRightPlayer = mat3.create();
    mat3.translate(mRightPlayer, m0, positions.rightPlayer);
    mat3.scale(mRightPlayer, mRightPlayer, scales.players)
    drawRectangle(mRightPlayer);

    var mBall = mat3.create();
    mat3.scale(mBall, m0, scales.ball);
    mat3.translate(mBall, mBall, positions.ball)
    drawRectangle(mBall);

    var mHalfWayLine = mat3.create();
    mat3.scale(mHalfWayLine, m0, [0.01,100])
    drawRectangle(mHalfWayLine);
}


// Key Handling

var key =
{
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    W: 87,
    S: 83
};


function isDown (keyCode)
{
    return key._pressed [keyCode];
}


function onKeydown (event)
{
    key._pressed [event.keyCode] = true;
}


function onKeyup (event)
{
    delete key._pressed [event.keyCode];
}
