import React from "react";

import img2 from "../assets/wireframe.png"


const Cards = ({
  header,
  choice
}) => {
  
  $('.special.cards .image').dimmer({
  on: 'hover'
});
const img={}

img[2]=img2


return(
    <div class="ui special cards">
      <div class="card">
        <div class="blurring dimmable image">
          <div class="ui dimmer">
            <div class="content">
              <div class="center">
                <div class="ui inverted button">Know More</div>
              </div>
            </div>
          </div>
          <img src={img[2]}/>
        </div>
        <div class="content">
          <a class="header">{header}</a>
        </div>
      </div>
      </div>




	);


};
export default Cards;
