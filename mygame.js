function game()
{
let config=
    {
        type:Phaser.AUTO,
        scale:
        {
            mode:Phaser.Scale.FIT,
            width:800,
            height:600
        },
        backgroundColor:0xffffcc,
        
        // add some physics to our game 
        physics:
        { 
            default:'arcade', // arcade is a physics engine which helps 
            arcade:
            {
                gravity:
                {
                    y:1000 // we add the gravity along y axis 
                }
            }
        },
        scene:
        {
            preload:preload,
            create:create,
           // update:update
        }
    };
let game=new Phaser.Game(config);
function preload()
    {
         console.log("In Preload Function");
        
         // Loading all the images 
        this.load.image('apple',"./assets/apple.png");
        this.load.image('sky','./assets/background.png');
        this.load.image('bottomground','./assets/bottomground.png');
        this.load.image('grass','./assts/grass.png');
        this.load.image('ray','./assets/ray.png');
        this.load.image('ground','./assets/topground.png');
        this.load.image('tree','./assets/tree.png');
        
        // we will add player from the spritesheet 
        this.load.spritesheet('dude','./assets/dude.png',{frameWidth:32,frameHeight:48});
    }
function create()
    {
     // lets create the ground
        w=game.config.width;
        h=game.config.height;
        var ground=this.add.tileSprite(0,h-128,w,128,'ground'); //tileSprite is used to place image as the entire specified width 
        ground.setOrigin(0,0); // it set the origin as corner 
        
      //lets create the sky 
        var background=this.add.sprite(0,0,'sky');
        background.setOrigin(0,0);
        background.displayWidth=w; // it will fill image to the entire width 
        background.displayHeight=h;
        background.depth=-1; // for push the background behind goroud \
    
      // adding the groups of fruits :- Physical Object
        var fruits=this.physics.add.group(
        {
            key:"apple",
            repeat:8,// how many apples we want
            setScale:{x:.2, y:.2},// reduce the xy factor of image by 80%
            setXY:{x:10,y:0,stepX:100} // set the XY coordinate 
        });
        
        
      // add the player 
        var player=this.physics.add.sprite(100,100,'dude',4); // 4 is the frame no of the player 
        
      this.physics.add.existing(ground);// applying the physics to the ground
        
      ground.body.allowGravity=false; // so that ground not move 
      ground.body.immovable=true;// when player colide the ground ground will not move 
    
     /*
     NOTE:--> Instead of above two function we can specify true argument in the physics.sdd.ec=xisting(ground,true)
              function it will make it static by default it is dynamic
    */
        
    
        
      this.physics.add.collider(player,ground); // detect collision between player and ground 
      this.physics.add.collider(fruits,ground); // detect collision between fruits and ground
        
    }
function update()
    {
         console.log("In Update Function");
    }
}