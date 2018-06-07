import React from "react";
import img1 from "../assets/style.jpg"
import img2 from "../assets/wireframe.png"
import img3 from "../assets/class.jpg"
import img4 from "../assets/grad.png"

const Cards = ({
  header,
  choice
}) => {
	    $('.special.cards .image').dimmer({
      on: 'hover'
    });
const img={}
img[1]=img1
img[2]=img2
img[3]=img3
img[4]=img4

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
