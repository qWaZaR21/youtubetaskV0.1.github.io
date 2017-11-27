const input = document.getElementById('inputForSearch');
const button = document.getElementById('searchBut');

const apiKey = 'AIzaSyBG4OZIeNoybuIdVmEnbcJf0QK1vEUiOWA';
const url = 'https://www.googleapis.com/youtube/v3/';

// window.onresize = function message() {alert("Размер окна изменен!");}

window.onresize = function render2() {render(result);}


var result;
var wraper;
var windowWidth;
var countVideo = 12;
var countBox;
var countItemBox;
var countScroll;
var scrollBar;


const getUrl = obj => {
    let result = url + obj.operation + '?';
    for (let key in obj) {
        if (key !== 'operation') {
            result += key + '=' + obj[key] + '&';
        }
    }
    console.log(result);
    return result.substring(0, result.length - 1);
}

function render (result) {

    if(result) {
        windowWidth = document.documentElement.clientWidth;
        countItemBox = Math.floor(windowWidth/340);
        countScroll = windowWidth/countItemBox;
        countBox = countVideo/countItemBox;


        /////////////////////////////////////
        if(wraper) {
            wraper.innerHTML = "";
            document.body.removeChild(scrollBar);
        }

        wraper = document.createElement('div');
        wraper.className = "wraper";
        document.body.appendChild(wraper);

        
        for (let i = 0; i < 12; ) {

            var box = document.createElement('div');
            box.className = "box";
            wraper.appendChild(box);

            for (let j = 0; j < countItemBox && i < 12; j++, i++) {
                
                /////////////////////////////////////////

                var item = document.createElement('div');
                item.className = "item";
                box.appendChild(item);
                /////////////////////////////////////////

                var container = document.createElement('div');
                container.className = "container";
                item.appendChild(container);

                var imgV = document.createElement('img');
                imgV.className = "img";
                imgV.src = result.preview[i];
                container.appendChild(imgV);    

                var titleV = document.createElement('div');
                titleV.className = "abs";
                container.appendChild(titleV);
                titleV.innerHTML = result.title[i];
                //////////////////////////////////////////
                //
                var authorV = document.createElement('div');
                authorV.className = "item_div";

                var span = document.createElement('span');
                span.className = "inscription";

                var iconUser = document.createElement('i');
                iconUser.className = 'fa fa-user';
                item.appendChild(authorV);
                authorV.appendChild(iconUser);
                authorV.appendChild(span);
                span.innerHTML = result.author[i];
                //
                //
                var publicationDateV = document.createElement('div');
                publicationDateV.className = "item_div";

                var span2 = document.createElement('span');
                span2.className = "inscription";

                var iconCalendar = document.createElement('i');
                iconCalendar.className = 'fa fa-calendar';
                item.appendChild(publicationDateV);
                publicationDateV.appendChild(iconCalendar);
                publicationDateV.appendChild(span2);
                span2.innerHTML = result.publicationDate[i].substring(0,10);
                //
                //
                var viewRateV = document.createElement('div');
                viewRateV.className = "item_div";

                var span3 = document.createElement('span');
                span3.className = "inscription";

                var iconTV = document.createElement('i');
                iconTV.className = 'fa fa-television';
                item.appendChild(viewRateV);
                viewRateV.appendChild(iconTV);
                viewRateV.appendChild(span3);
                span3.innerHTML = result.viewRate[i];
                //

                var descriptionV = document.createElement('div');
                descriptionV.className = "inscription2";
                item.appendChild(descriptionV);
                descriptionV.innerHTML = result.description[i];
                ////////////////////////////////////////////////////
            }
            
            wraper.appendChild(box);
        } 

        scrollBar = document.createElement('div');
        scrollBar.className = "scrollBar";
        document.body.appendChild(scrollBar);

        // var scrollLeft = document.createElement('i');
        // scrollLeft.className = "fa fa-chevron-left fa-2x";
        // scrollBar.appendChild(scrollLeft);
        // scrollLeft.addEventListener('click', goToLeft) ;

        var scrollCenter = document.createElement('div');
        scrollCenter.className = "scrollCenter";
        for (i = 0; i < countBox; i++) {
            var iconCircle= document.createElement('i');
            iconCircle.className = "fa fa-circle";
            iconCircle.number = i;
            scrollCenter.appendChild(iconCircle);
            iconCircle.addEventListener('click', goToBlock) ;
        }
        scrollBar.appendChild(scrollCenter);

        // var scrollRight = document.createElement('i');
        // scrollRight.className = "fa fa-chevron-right fa-2x";
        // scrollBar.appendChild(scrollRight);
        // scrollRight.addEventListener('click', goToRight) ;

        function goToBlock() {
            wraper.scrollTo(((windowWidth - 16) * (+this.number)), 0);
        };
    }
}

const loadYoutubeData = () => {
    
    if (input.value) {
        const ysxhr = new XMLHttpRequest();

        let request = {
            operation: 'search',
            key: apiKey,
            part: 'snippet,id',
            order: 'viewCount',
            q: input.value,
            maxResults: 12,
            type: 'video',
        }

        ysxhr.open('GET', getUrl(request), true);

        ysxhr.send();

        ysxhr.onreadystatechange = () => {
            if (ysxhr.readyState != 4) return;

            const responseS = JSON.parse(ysxhr.responseText);

            const yvxhr = new XMLHttpRequest();
            
            let videoIds = responseS.items.map(item => item.id.videoId).join();

            request = {
                operation: 'videos',
                key: apiKey,
                part: 'snippet,statistics',
                id: videoIds,
            }
            
            yvxhr.open('GET', getUrl(request), true);
            
            yvxhr.send();
            
            yvxhr.onreadystatechange = () => {
                if (yvxhr.readyState != 4) return;
                const responseV = JSON.parse(yvxhr.responseText);

                result = {
                    title: responseS.items.map(item => item.snippet.title),
                    preview: responseS.items.map(item => item.snippet.thumbnails.medium.url),
                    description: responseS.items.map(item => item.snippet.description),
                    author: responseS.items.map(item => item.snippet.channelTitle),
                    publicationDate: responseS.items.map(item => item.snippet.publishedAt),
                    viewRate: responseV.items.map(item => item.statistics.viewCount),
                    videoId: responseS.items.map(item => item.id.videoId),
                }

                render (result);
            }
        }    
    }
};

// const goToLeft = () => {
//     wraper.scrollBy(-340 , 0);
// };

// const goToRight = () => {
//     wraper.scrollBy(340 , 0);
// };


button.addEventListener('click', loadYoutubeData);

