class Section{
    static load = (loaderId, containerId, url, makeItems, makeItem) => {
        let loader = $(`${loaderId}`);
        loader.css("display","block");
        let carousel = $(`${containerId}`);
        carousel.css("display","none");
        $.ajax({
            url:url,
            success: (result) => makeItems(result, carousel, makeItem),
            complete: function() {
                loader.css("display", "none");
                carousel.css("display", "block");
            }
        })
    }
    static makeItems = (result, carousel, makeItem) => {
        for(let i = 0; i< result.length;i++){
            carousel.append(makeItem(result[i], i==0));
        }
    }
}

class Quote extends Section{
    static load = (loaderId, containerId, url) => {
        super.load(loaderId,containerId, url, this.makeItems, this.makeItem)
    }
    static makeItems = (result, carousel) => {
        super.makeItems(result, carousel, this.makeItem);
    }
    static makeItem = (item, first = false) => {
        let text = Create("p", "text-white");
        text.innerHTML = item.text;
        let pName = Create("h4", "text-white font-weight-bold");
        pName.innerHTML = item.name;
        let position = Create("span", "text-white");
        position.innerHTML = item.title;
    
        let quoteT = Create("div", "quote-text");
        appendChildren(quoteT, text, pName, position);
    
        let container2 = Create("div", "col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0");
        container2.appendChild(quoteT);
        
        let image = Create("img", "d-block align-self-center");
        image.src = item.pic_url;
        let imageC = Create("div", "col-12 col-sm-2 col-lg-2 offset-lg-1 text-center");
        imageC.appendChild(image);
    
        let container = Create("div", "row mx-auto align-items-center");
        appendChildren(container, imageC, container2);
    
        let cl = first ? "carousel-item active":"carousel-item";
        let Item = Create("div", cl);
        Item.appendChild(container);
    
        return Item;
    } 
}
class PopularTuts extends Section{
    static load = (loaderId, containerId, url) => {
        super.load(loaderId,containerId, url, this.makeItems, this.makeItem)
    }
    static makeItems = (result, carousel) => {
        super.makeItems(result, carousel, this.makeItem);
    }
    static makeItem = (item, first = false) => {

        let info = Create("div","info pt-3 d-flex justify-content-between");
        let rating = Create("div", "rating");
        for(let i =0;i<5;i++){
            let star = Create("img","");
            star.src = item.star > i ? "images/star_on.png":"images/star_off.png";
            star.style.width = "15px"
            rating.appendChild(star);
        }
        let time = Create("span","main-color");
        time.innerHTML = item.duration;

        appendChildren(info, rating, time);
       
        let creator = Create("div", "creator d-flex align-items-center");
        let creatorI = Create("img", "rounded-circle");
        creatorI.style.width = "30px"
        creatorI.src = item.author_pic_url;
        let creatorN = Create("h6", "pl-3 m-0 main-color");
        creatorN.innerHTML = item.author;

        appendChildren(creator, creatorI, creatorN);

        let cardBody = Create("div", "card-body");
        let H5 = Create("h5", "card-title font-weight-bold");
        H5.innerHTML = item.title;
        let pText = Create("p","card-text text-muted");
        pText.innerHTML = item["sub-title"];

        appendChildren(cardBody, H5, pText, creator, info);
        
        let card = Create("div", "card");
        let videoThumbnail = Create("img", "card-img-top");
        videoThumbnail.src = item.thumb_url;
        let overlay = Create("div", "card-img-overlay text-center");
        let Play = Create("img","align-self-center play-overlay");
        Play.src = "images/play.png";
        Play.style.width = "64px";
        overlay.appendChild(Play);
        appendChildren(card, videoThumbnail, overlay, cardBody);

        let Item = Create("div", "col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center justify-content-md-end justify-content-lg-center");
        Item.appendChild(card);
        let row = Create("div", "row mx-auto align-items-center");
        row.appendChild(Item);
        let cl = first ? "carousel-item active":"carousel-item";
        let main = Create("div", cl);
        main.appendChild(row);        
        return main;
    } 
}

function appendChildren (parent) {
    for(let i = 1;i<arguments.length;i++){
        parent.appendChild(arguments[i]);
    }
}
const Create = (tag, className) => {
    let Item = document.createElement(tag);
    Item.className = className;
    return Item;
}
function setup() {
    $("#pcarousel .carousel-item").each(function(){
        let next = $(this).next();
        for(let i=0;i<3;i++)
        {
            if(!next.length) 
                next = $(this).siblings(":first");
            next.children(":first-child").children(":first-child").clone().appendTo($(this).children(":first-child"));
            next = next.next();
        }
    })
}
$(document).ready(function(){
    Quote.load("#quote-loader","#carousel","https://smileschool-api.hbtn.info/quotes");
    PopularTuts.load("#pTuts-loader", "#pcarousel","https://smileschool-api.hbtn.info/popular-tutorials");
    setTimeout(setup, 200)
});