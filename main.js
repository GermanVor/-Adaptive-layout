let arr = [
  '"Well, Prince, so Genoa and Lucca are now just family estates of the Buonapartes.'
  +' But I warn you, if you dont tell me that this means war, if you still try to defend'+
  ' the infamies and horrors perpetrated by that Antichrist--I really believe he is Antichrist--I',
  ' will have nothing more to do with you and you are no longer my friend, no longer my faithful'+
  ' slave, as you call yourself! But how do you do? I see I have frightened you--sit down and'+
  ' tell me all the news."',
  'It was in July, 1805, and the speaker was the well-known Anna Pavlovna Scherer,'+
  ' maid of honor and favorite of the Empress Marya Fedorovna. With these words'+
  ' she greeted Prince Vasili Kuragin, a man of high rank and importance, who was'+
  ' the first to arrive at her reception. Anna Pavlovna had had a cough for some days.'+
  ' She was, as she said, suffering from la grippe; grippe being then a new word'+
  ' in St. Petersburg, used only by the elite.',
  'All her invitations without exception, written in French, and'+
  ' delivered by a scarlet-liveried footman that morning, ran as follows:',
  '"If you have nothing better to do, Count [or Prince], and'+
  ' if the prospect of spending an evening with a poor invalid is not too terrible,'+
  ' I shall be very charmed to see you tonight between 7 and 10--Annette Scherer."',
  '"Heavens! what a virulent attack!" replied the prince, not in the least'+
  ' disconcerted by this reception. He had just entered, wearing an embroidered'+
  ' court uniform, knee breeches, and shoes, and had stars on his breast and a'+
  ' serene expression on his flat face. He spoke in that refined French in',
  ' which our grandfathers not only spoke but thought, and with the gentle,'+
  ' patronizing intonation natural to a man of importance who had grown old'+
  ' in society and at court. He went up to Anna Pavlovna, kissed her hand,'+
  ' presenting to her his bald, scented, and shining head, and complacently seated himself on the sofa.',
  '"First of all, dear friend, tell me how you are. Set your friends mind at rest,"'+
  ' said he without altering his tone, beneath the politeness and affected sympathy'+
  ' of which indifference and even irony could be discerned.',
  '"Can one be well while suffering morally? Can one be calm in times like'+
  ' these if one has any feeling?" said Anna Pavlovna. "You are staying the whole evening, I hope?"',
  '"And the fete at the English ambassadors? Today is Wednesday. I must'+
  ' put in an appearance there," said the prince. "My daughter is coming for me to take me there."',
  '"I thought todays fete had been canceled. I confess all these festivities'+
  ' and fireworks are becoming wearisome."',
  '"If they had known that you wished it, the entertainment would have been put '+
  'off," said the prince, who, like a wound-up clock, by force of habit'+
  ' said things he did not even wish to be believed.',
  '"Dont tease! Well, and what has been decided about Novosiltsevs dispatch? You know everything."',
  '"What can one say about it?" replied the prince in a cold, listless tone.'+
  ' "What has been decided? They have decided that Buonaparte has burnt his boats,'+
  ' and I believe that we are ready to burn ours."',
];
arr = [...arr, ...arr.reverse() ];

window.addEventListener('scroll', function() {
  let Search = document.getElementById('SearchBar');
  let Menu = document.getElementById('Menu');
  let Content = document.getElementById('Content');

  if( pageYOffset > Menu.offsetHeight ){
    if( Search ){
      Search.classList.add('Fix');
      Content.style['padding-top'] = Search.offsetHeight+'px';
    }
  } else {
    Search.classList.remove('Fix');
    Content.style['padding-top'] = '0px';
  }
});

let limitForm = document.querySelector('input[name="limit"]');
let lengthForm = document.querySelector('input[name="length"]');
let but = document.querySelector('input[type="button"]');
let obj = {limit: undefined, length:undefined};

limitForm.oninput = lengthForm.oninput = function(){
  obj[this.name] = Number.isInteger(+this.value) && +this.value;
  
  if( obj.limit > 0 && obj.length > 0 ){
    but.classList.remove('ban');
    but.onclick = () => {
      limitForm.readOnly = lengthForm.readOnly = true;
      but.classList.add('ban');
      ButOn( obj, arr );
    }
  } else {
    but.classList.add('ban');
    but.onclick = undefined;
  }
}

let mapFunc = (a) => new Promise((resolve) => {
  setTimeout(() => resolve(a), ( Math.round(Math.random() * 9000) + 1000 ));
})

let Grid = document.querySelector('#Content .grid');

function TaskState(state, finish){
  let title = document.querySelector('#Content div.title');
  title.innerHTML = `Progress: ${state} of ${finish}`;
}
function DrawTask(data, ind){
  let p = document.querySelector('#Content .grid div[ind="'+ind+'"] p');
  p.innerHTML = data;
}
function DrawTitle(data, ind){
  let div = document.createElement('div');
  let r = Math.round(0.5 + Math.random() * (10));
  div.innerHTML = `<h1 class='block-with-text '>${ind+1} - ${data.split(' ').slice(0, r+10).join(' ')}</h1><p></p>`;
  div.setAttribute('ind', ind);
  Grid.append(div);
}
let LastInd = 0;// указатель на последний необработанный эл массива
let bell = 0; // указатель на число завершившихся задач
let LastCh = 0;//чтобы повторно вызывать функцию без перерисовки 
function MakeTask( func, arr, PromisArr, finish){
  if(LastInd < arr.length){
    let ind = LastInd++;

    DrawTitle(arr[ind], ind+LastCh )
    PromisArr[PromisArr.length] = func( arr[ind] )
      .then((res) => {
        DrawTask( arr[ind], ind+LastCh );
        TaskState(++bell, arr.length);
        if( bell === arr.length){
          finish(PromisArr);
        } else MakeTask( func, arr, PromisArr, finish);
        return res;
      })
  }
}

function queue( arr, func, limit){
  let PromisArr = [];
 
  return new Promise( res => {
    for( let k = 0; k < limit; k++){
      MakeTask( func, arr, PromisArr, res);
    }
  })
} 

function ButOn( {limit, length}, arr ){
  arr = arr.slice(0, length);

  let a = document.querySelector('#Content .grid div:last-child');
  if(a) LastCh = 1+ +a.getAttribute('ind');

  queue( arr, mapFunc, limit)
    .then(()=>{
      LastInd = bell = LastCh = 0;
      limitForm.readOnly = lengthForm.readOnly = false;
      but.classList.remove('ban');
    })
}