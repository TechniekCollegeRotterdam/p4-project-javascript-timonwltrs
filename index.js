const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const audio = new Audio("img/music/Kanye West - Gold Digger (Instrumental) (1).mp3")

canvas.width = 1024
canvas.height = 576


c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7



const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background/ownbckgrnd.jpg' 
})



const shop = new Sprite({
    position: {
        x: 600,
        y: 152
    },
    imageSrc: './img/decorations/shop_anim.png', 
    scale: 2.75,
    framesMax: 6
})



const player = new Fighter ({  
   position: {
    x: 0,
    y: 0
   },
   velocity: {
       x: 0,
       y: 0
   },
   offset: {
       x: 0 ,
       y: 0
   },
   imageSrc: './img/Martial Hero/Sprites/Idle.png',
   framesMax: 8,
   scale: 2.5,
   offset: {
    x: 215,
    y: 162
   },
   sprites: {
       idle: {
        imageSrc: './img/Martial Hero/Sprites/Idle.png',
        framesMax: 8
       },
       run: {
        imageSrc: './img/Martial Hero/Sprites/Run.png',
        framesMax: 8,
       
    },
    jump: {
     imageSrc: './img/Martial Hero/Sprites/Jump.png',
     framesMax: 2
    
 },
    fall: {
        imageSrc: './img/Martial Hero/Sprites/Fall.png',
        framesMax: 2
    },
    attack1: {
        imageSrc: './img/Martial Hero/Sprites/Attack1.png',
        framesMax: 6
    }
    ,
    takeHit: {
        imageSrc: './img/Martial Hero/Sprites/Take Hit - white silhouette.png',
        framesMax: 4
    },
    death: {
        imageSrc: './img/Martial Hero/Sprites/Death.png',
        framesMax: 6
    }
   },
   attackBox: {
    offset: {
        x: 100,
        y: 50
    },
    width: 160,
    height: 50
   }

})

const enemy = new Fighter ({  
    position: {
     x: 400,
     y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/Martial Hero 2/Sprites/Idle.png',
   framesMax: 4,
   scale: 2.5,
   offset: {
    x: 215,
    y: 175
   },
   sprites: {
       idle: {
        imageSrc: './img/Martial Hero 2/Sprites/Idle.png',
        framesMax: 4
       },
       run: {
        imageSrc: './img/Martial Hero 2/Sprites/Run.png',
        framesMax: 8,
       
    },
    jump: {
     imageSrc: './img/Martial Hero 2/Sprites/Jump.png',
     framesMax: 2
    
 },
    fall: {
        imageSrc: './img/Martial Hero 2/Sprites/Fall.png',
        framesMax: 2
    },
    attack1: {
        imageSrc: './img/Martial Hero 2/Sprites/Attack1.png',
        framesMax: 4
    },
    takeHit: {
        imageSrc: './img/Martial Hero 2/Sprites/Take hit.png',
        framesMax: 3
    },
    death: {
        imageSrc: './img/Martial Hero 2/Sprites/Death.png',
        framesMax: 7
    }

   },
   attackBox: {
    offset: {
        x: -170,
        y: 50
    },
    width: 170,
    height: 50
   }
 })
 

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    l: {
        pressed: false
    },
   j: {
        pressed: false
    },
   i: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    
    shop.update()
    c.fillStyle = 'rgba( 255,255,255, 0.12)'
    c.fillRect(0,0, canvas.width, canvas.height)
    player.update()
    enemy.update()


    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
     
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
      player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    //jumping
    if( player.velocity.y < 0){
    player.switchSprite('jump')
    } else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }

      // enemy movement
      if (keys.j.pressed && enemy.lastKey === 'j') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.l.pressed && enemy.lastKey === 'l') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

      //jumping
      if(enemy.velocity.y < 0){
       enemy.switchSprite('jump')
        } else if (enemy.velocity.y > 0){
           enemy.switchSprite('fall')
        }

    //detect for collision & enemy get hit
    if(
     rectangularCollision ({
         rectangle1: player ,
         rectangle2: enemy
     }) && 
       player.isAttacking && 
       player.framesCurrent === 4
        ) {
            enemy.takeHit()
           player.isAttacking = false
          
        
       gsap.to('#enemyHealth', {
        width: enemy.health + '%'
       })
    }


    // if player misses
    if(player.isAttacking && player.framesCurrent === 4 ){
        player.isAttacking = false
    }

    //this is where our player gets hit
    if(
        rectangularCollision ({
            rectangle1: enemy ,
            rectangle2: player
        }) && 
         enemy.isAttacking &&
          enemy.framesCurrent === 2
           ) {
            player.takeHit()
              enemy.isAttacking = false
           
              gsap.to('#playerHealth', {
                width: player.health + '%'
               })
            }

            if(enemy.isAttacking && enemy.framesCurrent === 2 ){
                enemy.isAttacking = false
            }
            

            // end the game based on health
            if (enemy.health <= 0 || player.health <= 0){
                determineWinner({player, enemy, timerId}) 

            }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead){

        audio.play();
    //controls for player
    
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey =  'd'
        break
        case 'a':
           keys.a.pressed = true
           player.lastKey = 'a'
        break
        case 'w':
           player.velocity.y = -20
        break
        case ' ':
          player.attack()
           break
        }
    }
    
    if ( !enemy.dead){
    switch(event.key){
        // controls enemy
        case 'l':
            keys.l.pressed = true
            enemy.lastKey = 'l'
        break

        case 'j':
           keys.j.pressed = true
           enemy.lastKey = 'j'
        break

        case 'i':
           enemy.velocity.y = -20
        break 
        case 'k':
         enemy.attack()
        break 
    }
 }

})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
        break
        case 'a':
            keys.a.pressed = false
        break

        case 'w':
            keys.w.pressed = false
        break
    }

    // enemy keys
    switch (event.key) {
        case 'l':
            keys.l.pressed = false
        break
        case 'j':
            keys.j.pressed = false
        break
        case 'i':
            keys.i.pressed = false
        break
    }
})

//made by timon
