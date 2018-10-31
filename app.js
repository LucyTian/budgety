// BUDGET CONTROLLER
var budgetController = (function(){
  
  // data structure:
  var data = {
    allItems: {
      dec: [],
      inc: []
    },
    
    totals: {
      dec: 0,
      inc: 0
    },
    
    budget: 0,
    
    percent: -1
  }

  var Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };
  
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  
  var calculateTotal = function(type){
    
    var sum = 0;
    
    data.allItems[type].forEach(function(element) {
      sum += element.value;
    });
    
    data.totals[type] = sum;
  }
  
  
  // 1. add the item
  var addItem = function(type, description, val){
    var newItem, ID;
    
    // create new ID, the last item's id plus one
    if (data.allItems[type].length === 0) {
      ID = 0;
    } else {
      ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
    }
   
    newItem = type === 'inc'? new Income(ID, description, val): new Expense(ID, description, val);
    
    data.allItems[type].push(newItem);
    return newItem;
  };
  
  // 2. delete the item
  var deleteItem = function() {
    
  };
  
  
  // 3. update the budget 
  var calculateBudget = function() {
    calculateTotal('inc');
    calculateTotal('dec');
    
    data.budget = data.totals.inc - data.totals.dec;
    
    if (data.totals.inc > 0) {
       data.percent = Math.round(data.totals.dec / data.totals.inc * 100);
    } else {
       data.percent = -1;
    }
    
   
    //return data;
  };
  
  var getBudget = function() {
    return {
      budget: data.budget,
      percent: data.percent ,
      totalIncome: data.totals['inc'],
      totalExpense: data.totals['dec']
    }
  }
  
  return {
    addItem: addItem,
    deleteItem: deleteItem,
    calculateBudget: calculateBudget,
    getBudget: getBudget
  }
  
  
})();


// UI CONTROLLER
var UIController = (function(){

  var DOMString = {
    inputType: '.add-type',
    inputDescription: '#input-description',
    inputValue: '#input-value',
    inputButton: '.submit-btn',
    
    incomeContainer: '.income-list',
    expenseContainer: '.expense-list',
    
    budget: '#show-balance',
    totalIncome: '#income-value',
    totalExpense: '#expense-value',
    expensePercent: '#expense-percentage'
  }

  return {
    
    // 1. get the user input function
    getInput: function(){
      return {
        type: document.querySelector(DOMString.inputType).value, // 'inc' or 'dec'
        description: document.querySelector(DOMString.inputDescription).value,
        value: parseFloat(document.querySelector(DOMString.inputValue).value)
      }
    },
    
    // 2. add list item to the history panel
    addListItem: function(obj, type) {
      
  
      var html, element;
      
      // create HTML string with placeholder text
      
      if (type === 'inc') {
        html = '<div class="row" id="income-list-%id%"> <div class="col-sm-8 item-description"> %description% </div> <div class="col-sm-4"> <div class="amount">%value%</div> <div class="delete-item"> <button class="btn" type="submit"><i class="fas fa-minus-circle fa-2x"></i></button> </div></div></div>';
        
        element = document.querySelector(DOMString.incomeContainer);
      } else if (type === 'dec'){
        html = '<div class="row" id="income-list-%id%"> <div class="col-sm-8 item-description"> %description% </div> <div class="col-sm-4"> <div class="amount">%value%</div>  <div class="list-percentage">%percent%</div> <div class="delete-item"><button class="btn" type="submit"><i class="fas fa-minus-circle fa-2x"></i></button> </div> </div> </div>';
        
        element = document.querySelector(DOMString.expenseContainer);
      }
      
      // replace the placeholder text with actual value
      html = html.replace('%id%', obj.id);
      html = html.replace('%description%', obj.description);
      html = html.replace('%value%', obj.value);
      
      // insert the html into the doc
      
      element.insertAdjacentHTML('beforeend', html);
    },
    
    
    // 3. clear the user input after click enter or mouse click
    clearInput: function(){
      
      var fields, fieldsArr;
      
      // filelds is a nodeList
      fields = document.querySelectorAll(DOMString.inputDescription + ', '+ DOMString.inputValue);
     
      // convert the fields to array using array prototype's slice method to shallow copy the whole node list
      fieldsArr = Array.prototype.slice.call(fields);
      
      // Array has for each method takes in a function with element parameter
      fieldsArr.forEach(function(cur, index, arr){
         cur.value = '';
      });
      
      // focus on the description
      fieldsArr[0].focus();
    },
    
    // 4. update the budget in the UI
    displayBudget: function(budget) {
      
      document.querySelector(DOMString.budget).textContent = budget.budget ;
      
      document.querySelector(DOMString.totalIncome).innerText = budget.totalIncome;

      document.querySelector(DOMString.totalExpense).textContent = budget.totalExpense;
      
      document.querySelector(DOMString.expensePercent).textContent = budget.percent > 0 ? budget.percent + '%' : '---';
      
    },
    
    // helper function to get the element from html
    getDOMString: function() {
      return DOMString;
    }
  }

})();


// GLOBAL APPLICATION CONTROLLER
var appController = (function(bugetCtrl, UICtrl){

  // Add function to add event listener called in the init
  var addEventListener = function() {
    var DOM = UICtrl.getDOMString();
    // add event listner to the submit button
    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){

      // some older browser have property of which 
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  }

  // ctrlAdd item function
  var ctrlAddItem = function(){
    var input, newItem;
    // 1. get the input 
    input = UICtrl.getInput();
    
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. add the item to the budget
    newItem = bugetCtrl.addItem(input.type, input.description, input.value);

    // 3. add the item to the interface
    UICtrl.addListItem(newItem, input.type);
    
    // 4. clear the input field
    UICtrl.clearInput();

    // 5. calculate and update the display the budget on the UI
    updateBudget();
    
    }
  };
  
  
  var updateBudget = function (){
    // 1. calculate the budget
    bugetCtrl.calculateBudget(); 
    
    // 2. return the budget
    var budget = bugetCtrl.getBudget();
    
    // 3. update the budget in the UI
    UICtrl.displayBudget (budget);
  }


  return ({
    init: function() {
      console.log("Application has started");
      
      UICtrl.displayBudget ({
        budget: 0,
        percent: -1,
        totalIncome: 0,
        totalExpense: 0
      });
      
      addEventListener();
    }
  });

})(budgetController, UIController);

appController.init(); 