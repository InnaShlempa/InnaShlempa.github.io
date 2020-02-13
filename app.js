'use strict';

class Users {
    constructor($profile) {
        this.$profile = $profile;
        this.$button = this.$profile.find('[data-users-load]');
        this.$users = this.$profile.find('[data-users]');
        this.usersLoad();
    }

    usersLoad() {//при клике на кнопку запускается прелоадер
        this.$button.on('click', () => {
            this.preloader(true)

            fetch(`https://randomuser.me/api/?results=${this.getRandom(0, 100)}`)
			
			/*конвертируем получение данные с помощью метода response.json в json, 
			этот метод возвращает promise, который, когда получен ответ, 
			вызывает коллбэк с результатом парсинга ответа в json.  */
				.then(response => {//если все ок, то 
					if (response.ok) { 
					 response.json()
						.then(response => {//преобразовуем данные с json формата  в объект и дальше работаем уже как с объектом
						this.array = response.results;
						console.log('users', this.array)//вывод объекта пользователей в консоль
						})				
					} else {//если статус ответа не ок, то выполняем Promise.reject, который возвращает отклонённый
					//promise со статусом  ошибки
					   return Promise.reject({
							status: response.status,
												
						});				
				  }
				  
                setTimeout(() => { //время ожидания прелоадера до загрузки пользователей
                    this.preloader(false, 'load-end')
                    this.initGrid(this.array);                                    
                }, 2000)
            })
			.catch(() => this.preloader(false, 'error'));//если ошибка,то прелоадер
        })
    }
	
	preloader(state, type) {
			if (state) {
				this.$button.addClass('preload');
			} else {
				this.$button.addClass(type);
			}
		}
   
    getRandom(min, max) {
        let random;
        if (min || max) {
            random = Math.floor(Math.random() * (max - min) + min);//максимум не включается, минимум включается
        } else {
            random = Math.floor(Math.random() * 100);
        }
        return random;
    }
	
	
	setGender(element) {
			if (element.gender === 'male') {
				this.userMan.push(element);// если мужской пол, то добавляем элементы в масив userMan
			} else  {
				this.userWoman.push(element)//если все другой, то в userWoman
			}
		}
		//стоим сетку профилей пользователей
    initGrid(user) {
        let userGrid = []; //масив, который хранит сетку профилей пользователей
        let list = '';

        let userNat = [];  //национальности пользователей
        let userNatLenght = [];//сколько пользоватей с одной страны
		
        let listNat = '';
        let indexNat = 0;
        
        this.userMan = []; //мужчины
        this.userWoman = []; //женщины

        user.forEach((element) => { //с помощью метод forEach() стоим сетку профилей пользователей
            list += `
                            <div class='user'>
								<div class="user__wrapper">
									<div class='user__img'>
										<img src='${element.picture.large}' class="user__picture">
									</div>
									<div class='user__info'>
										<div class='user__name'>
											${element.name.title}
											${element.name.first}
											${element.name.last}                                
										</div>
										<div class='user__gender'>
											${element.gender}
										</div>
										<div class='user__phone'>
											${element.phone}
										</div>
										<div class='user__email'>
											${element.email}
										</div>
										<div class='user__address'>
											${element.location.state}
											${element.location.city}
											${element.location.street.name}
											${element.location.street.number}
										</div>							
										<div class='user__birthday'>
											Date of Birth - ${new Date(element.dob.date).toLocaleDateString()}
										</div>
										<div class='user__registration'>
											Date of Registered - ${new Date(element.registered.date).toLocaleDateString()}
										</div>									
									</div>
								</div>
                            </div>
                        `;

            this.setGender(element);
			
				//определяем количество пользователей с каждой страны
            if (!userNat.includes(element.nat)) { 
                userNat.push(element.nat);
                userNatLenght = user.filter(item => item.nat === element.nat);
                listNat += `
								<div class='users__stats'> ${userNat[indexNat++] + ` - ` + userNatLenght.length} users</div>
								`;
            }
        });
		
		//сравнение кого больше мужчин или женщмн
		let compareGender;
        if (this.userMan.length === this.userWoman.length) { // если длина масив userMan = длине масива userWoman, то равное количество
            compareGender = 'Amount of men and women is equal';
        } else if (this.userMan.length > this.userWoman.length) {
            compareGender = 'More men than women';
        } else if (this.userMan.length < this.userWoman.length) {
            compareGender = 'More women than men';
        }
		//выводим статусы ответа: сколько всего пользователей,сколько мужчин, сколько женщин, кого больше
        let listStats = `
                            <div class='users__stats stats_users '>Amount of users : ${user.length}</div>
                            <div class='users__stats stats_users'>Man : ${this.userMan.length}</div>
                            <div class='users__stats stats_users'>Women : ${this.userWoman.length}</div>
                            <div class='users__stats stats_users'>${compareGender}</div>
                        `;

        userGrid.push(list);
        userGrid.push(listStats);
        userGrid.push(listNat);

        this.$users.html(userGrid.join('')); //возвращает json обращенный в объект 
    }
}

new Users($('.profile'));
