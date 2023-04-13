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
    new Formulation('Глюкоза 5%, 400 мл', 400, 0, 0, 20, 80),
    new Formulation('Глюкоза 10%, 400 мл', 400, 0, 0, 40, 160),
    new Formulation('Глюкоза 20%, 400 мл', 400, 0, 0, 80, 320),
    new Formulation('Глюкоза 40%, 400 мл', 400, 0, 0, 160, 640),
    new Formulation('Вамин 14, 500 мл', 500, 42.5, 0, 0, 175),
    new Formulation('Вамин 18, 500 мл', 500, 57, 0, 0, 230),
    new Formulation('Интралипид 10%, 500 мл', 500, 0, 50, 0, 500),
    new Formulation('Интралипид 20%, 500 мл', 500, 0, 100, 0, 1000),
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
    paragraphs[3].innerHTML='Общая энергетическая ценность: '+Math.round(result.energy)+' ккал, ';
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
    item=document.getElementById('infoBoard')
    item.querySelector('p').innerHTML='Расчётные показатели данного калькулятора являются ориентировочными и ни в коей мере не заменяют врачебные назначения с учетом конкретной клинической ситуации.'
    item.classList.add("bg-white", "m-2", "p-2", "br2");  
}
function infoAbout(){
    item=document.getElementById('infoBoard')
    item.querySelector('p').innerHTML="Дизайн: Александра Сирош, junior UX/UI designer, <a href = 'mailto: alexasiroshdesign@gmail.com' class='violet-text'>alexasiroshdesign@gmail.com</a></p><p>Идея, разработка: Марина Сенько, врач-анестезиолог-реаниматолог, junior Python/Django developer, <a class='violet-text' href = 'mailto: m.senko.belarus@gmail.com'>m.senko.belarus@gmail.com</a></p><p>Made with <a class='violet-text' href='https://getbootstrap.com/'>Bootstrap</a>"
    item.classList.add("bg-white", "m-2", "p-2", "br2");
}


