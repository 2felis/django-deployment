
    document.getElementById('jsAlert').innerHTML='Воспользуйтесь им для расчёта нутритивной и энергетической ценности назначаемого вами парентерального питания. Надеемся, он будет вам полезен.'
    
    class Formulation{
    constructor(name='', volume=0, prot=0, fat=0, carb=0, energy=0){
        this.name=name;
        this.volume=volume;
        this.prot=prot;
        this.fat=fat;
        this.carb=carb;
        this.energy=energy;
    };
    protCal(){
        if(this.prot==0){
            return 0;
        }
        else if((this.carb==0)&&(this.fat==0)){
            return this.energy;
        }
        else{
            let empiricalProtCal=this.prot*4;
            let empiricalNonProtCal=(this.carb*4)+(this.fat*9);
            return empiricalProtCal/(empiricalNonProtCal+empiricalProtCal)*this.energy;
        }
        };
    }
    
    
function summ (form1, form2, n_form2) {  //takes in 2 Formulation objects and integer. returns 1 Formulation object where properties are sums of properties of 1st object and (2nd obj * integer)//
    let newForm=new Formulation();
    for (const key of Object.keys(newForm)) {
        if (key!='name'){
            newForm[key]=form1[key]+form2[key]*n_form2;
        }
    };
    return newForm
} 

//all available pn formulations stored here
const pharmacy=[
    new Formulation('Глюкоза 5%, 500 мл', 500, 0, 0, 25, 100),
    new Formulation('Глюкоза 10%, 500 мл', 500, 0, 0, 50, 200),
    new Formulation('Глюкоза 20%, 400 мл', 400, 0, 0, 80, 320),
    new Formulation('Глюкоза 20%, 500 мл', 500, 0, 0, 100, 400),
    new Formulation('Глюкоза 40%, 400 мл', 400, 0, 0, 160, 640),
    new Formulation('Вамин 14, 500 мл', 500, 42.5, 0, 0, 175),
    new Formulation('Вамин 18, 500 мл', 500, 57, 0, 0, 230),
    new Formulation('Гамамин 40, 400 мл', 400, 16, 0, 0, 148),
    new Formulation('Интралипид 10%, 500 мл', 500, 0, 50, 0, 500),
    new Formulation('Интралипид 20%, 500 мл', 500, 0, 100, 0, 1000),
    new Formulation('Кабивен 900 ккал, 1026 мл', 1026, 34, 40, 100, 900),
    new Formulation('Кабивен 1400 ккал, 1540 мл', 1540, 51, 60, 150, 1400),
    new Formulation('Кабивен 1900 ккал, 2053 мл', 2053, 68, 80, 200, 1900),
    new Formulation('Кабивен 2300 ккал, 2566 мл', 2566, 85, 100, 250, 2300),
]  //propofol values stored in calculate()




function addAnother (){
    let options=document.querySelectorAll('.selection');
    if (options.length<10){
        let example_element=document.querySelector('.selection')
        let new_element=example_element.cloneNode(true);
        let radioList=new_element.getElementsByTagName("input");
        for(var j = 0; j < radioList.length; j++){
            radioList[j].name='RadioQty'+options.length;
            }
            radioList[0].checked=true;
        let menu=document.getElementById('selectionForm');
        menu.appendChild(new_element);
        } else {
            document.getElementById('addAnotherBtn').disabled=true;
        }
}



function propofolDosageShow(){
    let propofolDosage=document.getElementById('propofolRange').value;
    document.getElementById('propofolDosageLabel').innerHTML=propofolDosage+' мл/ч';
    calculate();
}


function calculate(){
    //adding all selected formulations
    let result= new Formulation ();
    let options=document.querySelectorAll('.selection');
    for (let item of options){
        let selectedFormulation=new Formulation ()
        let chosen=item.querySelector('.formulations').value;
        for (let option of pharmacy){
            if(option.name==chosen){
                selectedFormulation=option
            }
        }
        let qty=0;
        let radioList=item.getElementsByTagName("input");
        for(var j = 0; j < radioList.length; j++){
            if(radioList[j].checked){
                qty=radioList[j].value;
            }
        }
        result=summ(result, selectedFormulation, qty);        
    }


    //adding propofol 
    let propofolDosage=document.getElementById('propofolRange').value;
    let propofol=new Formulation('', (Math.round(propofolDosage*24/10))*10, 0, propofolDosage*2.4, 0, propofolDosage*26.4);
    result=summ(result, propofol, 1);

    //calculating bmi
    let bmi=0;
    if (document.getElementById('heigth').value.length>0){
        bmi=Math.round(parseInt(document.getElementById('weight').value)/((parseInt(document.getElementById('heigth').value)/100)**2))
    };


    //printing results
    let resultBlock=document.querySelector('.calculatedResults');
    let paragraphs=resultBlock.querySelectorAll('p');
    if (bmi>0){
        if((bmi<16)&&(bmi>5)){
            paragraphs[0].innerHTML='ИМТ пациента: '+bmi+', выраженный дефицит массы тела.'
        }
        else if (bmi<19){
            paragraphs[0].innerHTML='ИМТ пациента: '+bmi+', дефицит массы тела.'
        }
        else if (bmi<26){
            paragraphs[0].innerHTML='ИМТ пациента: '+bmi+', нормальная масса тела.'
        }
        else if (bmi<31){
            paragraphs[0].innerHTML='ИМТ пациента: '+bmi+', избыточная масса тела.'
        }
        else if (bmi<36){
            paragraphs[0].innerHTML='ИМТ пациента: '+bmi+', ожирение 1 степени.'
        }
        else if (bmi<41){
            paragraphs[0].innerHTML='ИМТ пациента: '+bmi+', ожирение 2 степени.'
        }
        else if (bmi<200){
            paragraphs[0].innerHTML='ИМТ пациента: '+bmi+', ожирение 3 степени.'
        }
        else {
            paragraphs[0].innerHTML='ИМТ пациента: '
        }
    }
    if((document.getElementById('weight').value<25)||(document.getElementById('weight').value>500)||(document.getElementById('heigth').value<100)||(document.getElementById('heigth').value>250)){
        paragraphs[0].innerHTML='ИМТ пациента: '
    }
    paragraphs[2].innerHTML='Общий объём: '+Math.round(result.volume)+' мл,';
    paragraphs[3].innerHTML='Общая энергетическая ценность: '+Math.round(result.energy)+' ккал (из них белковая: около '+Math.round(result.protCal())+' ккал), ';
    if (parseInt(document.getElementById('weight').value)>0){
        paragraphs[3].innerHTML+=(Math.round(result.energy/parseInt(document.getElementById('weight').value))+' ккал/кг.')
    }
    paragraphs[4].innerHTML='Аминокислоты: '+Math.round(result.prot)+' г, ';
    if (parseInt(document.getElementById('weight').value)>0){
        paragraphs[4].innerHTML+=(Math.round(result.prot*10/parseInt(document.getElementById('weight').value)))/10+' г/кг.'
    }
    paragraphs[5].innerHTML='Жиры: '+Math.round(result.fat)+' г,';
    paragraphs[6].innerHTML='Углеводы: '+Math.round(result.carb)+' г.';
}

//info block
function infoImportant(){
    document.getElementById('infoImportant').classList.remove("hidden");
    document.getElementById('infoAbout').classList.add("hidden");  
}
function infoAbout(){
    document.getElementById('infoImportant').classList.add("hidden");
    document.getElementById('infoAbout').classList.remove("hidden");
}

