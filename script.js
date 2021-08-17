'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
class Workout{
	date=new Date();
	id=(new Date() +'').slice(-10);
	constructor(coords,distance,duration){
		this.coords=coords;
		this.distance=distance;
		this.duration=duration;
	}
	_setDescription(){
		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description=` ${this.type[0].toUppercase()}${this.type.slice(1)}on
        ${months[this.date.getMonth()]}${this.date.getDate()}`;
       
	}
};
class Running extends Workout{
	constructor(coords,distance,duration,cadence){
		super(coords,distance,duration);
		this.cadence=cadence;
         this.calcPace();
         this._setDescription();
	}

	//adding method
	calcPace(){
		this.pace=this.duration/this.distance;
	    return this.pace;
}
}
class Cycling extends Workout{
	constructor(coords,distance,duration,Elevgain){
		super(coords,distance,duration);
		this.Elevgain=Elevgain;
	    this.calcSpeed();
	    this._setDescription();
	}
    calcSpeed(){
		this.speed=this.distance/this.duration;
	    return this.speed;
	}
}

class App {
	#map;
	#mapEvent;
	#workouts=[];
	constructor(){
			this._getPosition();
			form.addEventListener('submit',this._newWorkout.bind(this));
			inputType.addEventListener('change',this._toggleElevationField.bind(this));
	      } 
		_getPosition(){
			if(navigator.geolocation)
	        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function(){
				alert('	could not access your loaction');
			});
	
		}
		_loadMap(position){
			const {latitude}=position.coords;
			const {longitude}=position.coords;
			console.log(`https://www.google.co.in/maps/@${latitude},${longitude},15z`);
			const coords=[latitude,longitude]
	 // dispalying the map
			this.#map = L.map('map').setView(coords, 13);
	
			L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(this.#map);
	
			this.#map.on('click',this._showForm.bind(this));
			
		}
		_showForm(mapE){
				this.#mapEvent=mapE;
			    form.classList.remove('hidden');
			    inputDistance.focus();
			
		}
		_toggleElevationField(){
			
	inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
	inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
			
		}
		_newWorkout(e){
			const validInputs=(...inputs)=>
			inputs.every(inp=>Number.isFinite(inp));
			const allPositive=(...inputs)=>
			inputs.every(inp=>inp>0);
	        e.preventDefault();
			let workout;
			// get data from form
              const type=inputType.value;
              const distance=+inputDistance.value;
              const duration=+inputDuration.value;
               const {lat,lng}=this.#mapEvent.latlng;

			//if  workout running create running object
              if(type==='running'){
              	const cadence=+inputCadence.value;
              			//check if data is valid
              	if(
              		!validInputs(distance,duration,cadence)||
              		!allPositive(distance,duration,cadence))
                 return alert('inputs have to be positive');
            workout = new Running([lat, lng], distance, duration, cadence);
          }
          
			//if  workout cyling create cyling object
			    if(type==='cyling'){
              	const elevation=+inputElevation.value;
              if(!validInputs(distance,duration,elevation)||
              		!allPositive(distance,duration)){
                 return alert('inputs have to be positive')};
            workout = new Cycling([lat, lng], distance, duration, elevation);
               
          }

			//add anew object to workout array
				this.#workouts.push(workout);
				console.log(workout);
			//render workout on map as marker
			 this._renderWorkoutMarker(workout);
	// 		    // // adding marker
             // const coordds=this.#mapEvent.latlng;
            
			//render workout on the list

			//hide form+ clear input fields	
			inputDistance.value=inputDuration.value=inputElevation.value=inputCadence.value='';
			}
			 _renderWorkoutMarker(workout){
			 	 const {lat,lng}=this.#mapEvent.latlng;
			 	 let type;
                       L.marker(workout.coords)
             		    .addTo(this.#map)
             			.bindPopup(L.popup({	
             			    	maxWidth	:300,
             			    	minWidth:50,
             			    	closeOnClick:false,
             			    	autoClose:false,
             			    	className:`${type}-popup`})
             			    )
                         .setPopupContent('workout.distance')
                         .openPopup();
             			}
            _renderWorkout(workout){
            	const html=`
            	<li class="workout workout--${Workout.type}" data-id=${Workout.id}>
		        <h2 class="workout__title">${Workout.description}</h2>
		        <div class="workout__details">
		            <span class="workout__icon">${Workout.name==='running'?'🏃‍♂️':'🚴‍♀️'}</span>
		            <span class="workout__value">${Workout.distance}</span>
		            <span class="workout__unit">km</span>
	            </div>
               <div class="workout__details">
		            <span class="workout__icon">⏱</span>
		            <span class="workout__value">${Workout.duration}</span>
		            <span class="workout__unit">min</span>
               </div>`
            }
            
            	
};
				
const app=new App();
