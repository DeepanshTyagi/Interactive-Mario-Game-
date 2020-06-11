function game()
{
let config=
    {
        type:Phaser.AUTO,
        scale:
        {
            mode:Phaser.Scale.FIT,
            width:1320,
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
                },
                debug:false // it create a rectangular box around the objects 
            }
        },
        scene:
        {
            preload:preload,
            create:create,
           update:update
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
        
        
        // create rays on the top of background
        let rays=[];
        for(var i=-10;i<=10;i++)
            {
        let ray=this.add.sprite(w/2,h-100,'ray');
        ray.setOrigin(0.5,1);// set the origin of ray
         ray.alpha=.2; // add the transparancy 
        ray.displayHeight=1.2*h;
        ray.depth=-1;
        ray.angle=i*20;  // change the angle of rays 
        rays.push(ray);
            }
        
        // add the tween 
        this.tweens.add(
        {
           targets:rays,
            props:
            {
                angle:
                {
                    value:"+=20",
                }
            },
          duration:8000,
           repeat:-1
        });
       
        
        
      // adding the groups of fruits :- Physical Object
        var fruits=this.physics.add.group(
        {
            key:"apple",
            repeat:8,// how many apples we want
            setScale:{x:.2, y:.2},// reduce the xy factor of image by 80%
            setXY:{x:10,y:0,stepX:100} // set the XY coordinate 
        });
        console.log(fruits);
        
        // adding the bounce effect to all the physics object 
        fruits.children.iterate(function(f) // iterate over all the object of fruits object 
        {
                      f.setBounce(Phaser.Math.FloatBetween(0.4,0.8));          
        });
        
      // add the player 
        this.player=this.physics.add.sprite(100,100,'dude',4); // 4 is the frame no of the player
      
      // adding the bouncing effect to the player 
        this.player.setBounce(0.5); // if our Bounce factor is less than 1 than there is a loss of energy in the bounce
        console.log(this.player);
        this.player.setCollideWorldBounds(true); // so that player does not move outside the frame 
        
        // Create a group of plateforms 
        let plateforms=this.physics.add.staticGroup();
        plateforms.create(500,350,'ground').setScale(2,.5).refreshBody();
        plateforms.create(700,200,'ground').setScale(2,.5).refreshBody();
        plateforms.create(100,200,'ground').setScale(2,.5).refreshBody();
        plateforms.add(ground); // also add ground to the plateforms \
        
        // create player animation and player moveemnt 
        this.anims.create({
           key:'left',
           frames:this.anims.generateFrameNumbers('dude',{start:0,end:3}),
           frameRate:10, // how many frames we want in  per second
            repeat:-1
        });
        
        this.anims.create({
           key:'right',
            frames:this.anims.generateFrameNumbers('dude',{start:5,end:8}),
            framRate:10,
            repeat:-1
        });
        
        this.anims.create({
           key:'center',
            frames:this.anims.generateFrameNumbers('dude',{start:4,end:4}),
            framerate:10
        });
        // keyboard action 
        this.cursor=this.input.keyboard.createCursorKeys();
        
      this.physics.add.existing(ground);// applying the physics to the ground
        
      ground.body.allowGravity=false; // so that ground not move 
      ground.body.immovable=true;// when player colide the ground ground will not move 
    
     /*
     NOTE:--> Instead of above two function we can specify true argument in the physics.sdd.ec=xisting(ground,true)
              function it will make it static by default it is dynamic
    */
        
    
        
      this.physics.add.collider(this.player,ground); // detect collision between player and ground 
      this.physics.add.collider(fruits,ground); // detect collision between fruits and ground
       this.physics.add.collider(plateforms,fruits);
        this.physics.add.collider(plateforms,this.player); 
        // this.physics.add.collider(fruits,this.player); //instead of this we add overlap function between player and fruits 
        this.physics.add.overlap(this.player,fruits,eatfruits,null,this);
        
        // create cameras 
        this.cameras.main.setBounds(0,0,w,h);
        this.physics.world.setBounds(0,0,w,h);
        
        this.cameras.main.startFollow(this.player,true,true); // focus on the player 
        
        setTimeout(()=>{
            this.cameras.main.setZoom(1.5); // zoom on the player
        },3000); // after 2 seconds 
            
        
    }
var eatfruits=(player,fruits)=>
{
    fruits.disableBody(true,true); // disable the visibility od fruit object 
}
let player_config=
    {
        player_speed:150,
        player_jumpSpeed:-900
    }
function update()
    {
         console.log("In Update Function");
        if(this.cursor.left.isDown)
            {
                this.player.setVelocityX(-player_config.player_speed); // move player along X axis to the left  
                this.player.anims.play('left',true);
            }
        else if(this.cursor.right.isDown)
            {
                this.player.setVelocityX(player_config.player_speed);
                this.player.anims.play('right',true);
            }
        else  // if if don't press key then we want player not move 
            {
                this.player.setVelocityX(0);
                this.player.anims.play('center');
            }
        
        // add the jump to the player when player touch the ground or the plateforms 
        if(this.cursor.up.isDown && this.player.body.touching.down)
            {
                this.player.setVelocityY(player_config.player_jumpSpeed);
            }
    }
}
