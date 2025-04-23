import React, { useEffect, useState } from 'react';
import './fishTank.css';

const FishTank = () => {
  // Peces
  const [fishes, setFishes] = useState([]);  
  const [visibleFishes, setVisibleFishes] = useState([]);  

  useEffect(() => {
    //Agarrar peces del backend
    fetch('http://localhost:5000/fish')
      .then(res => res.json())
      .then(data => {
        setFishes(data);
        setVisibleFishes(getInitialFishes(data)); 
      });
  }, []);

  //Mostrar peces aleatoreos
  const getInitialFishes = (fishList) => {
    const count = Math.min(6, fishList.length);  // Solo se pueden 6 peces a la vez
    const shuffled = [...fishList].sort(() => 0.5 - Math.random());  // Poner peces aleatoreos
    return shuffled.slice(0, count);
  };

  // Darle animacion a los peces
  const getRandomAnimation = (direction) => {
    const animations = [
      'swimWave',
      'swimZigzag',
      'swimLoop',
      'swimDive',
      'swimCurve',
      'swimFigure8'
    ];
    const base = animations[Math.floor(Math.random() * animations.length)];
    return direction === 'left' ? `${base}Reverse` : base;  // izquierda o derecha idk
  };

  // Loop de imagenes y peces
  const handleAnimationIteration = () => {
    if (fishes.length > 6) {
      setVisibleFishes(prevFishes => {
        const available = fishes.filter(f => !prevFishes.includes(f));
        if (available.length < 6) {
          return getInitialFishes(fishes);  // Regresar a los peces iniciales si ya se mostraron todos
        }
        const shuffled = [...available].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 6);  // Nuevos peces de manera aletorea
      });
    }
  };

  return (
    <div className="fish-tank">
      {visibleFishes.map((fish, index) => {
        const direction = Math.random() > 0.5 ? 'right' : 'left';  
        const animationType = getRandomAnimation(direction);  
        const size = Math.random() * 250 + 200; 
        const duration = Math.random() * 15 + 10;

        return (
          <img
            key={`${fish}-${index}`}
            src={`http://localhost:5000/fish/${fish}`}  
            className={`fish ${animationType}`}  
            style={{
              animationDelay: `${index * 2}s`, 
              top: `${Math.random() * 80 + 10}%`, 
              width: `${size}px`, 
              height: 'auto',
              animationDuration: `${duration}s`,  
              zIndex: Math.floor(Math.random() * 10), 
              visibility: 'hidden', 
            }}
            alt="Swimming fish"
            onAnimationIteration={handleAnimationIteration}  
          />
        );
      })}
    </div>
  );
};

export default FishTank;
