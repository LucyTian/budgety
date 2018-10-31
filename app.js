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
    }
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
  
  
  var deleteItem = function() {
    
  };
  
  return {
    addItem: addItem,
    deleteItem: deleteItem
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
    expenseContainer: '.expense-list'
  }

  return {
    getInput: function(){
      return {
        type: document.querySelector(DOMString.inputType).value, // 'inc' or 'dec'
        description: document.querySelector(DOMString.inputDescription).value,
        value: document.querySelector(DOMString.inputValue).value
      }
    },

    getDOMString: function() {
      return DOMString;
    },
    
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

    // 2. add the item to the budget
    newItem = bugetCtrl.addItem(input.type, input.description, input.value);

    // 3. add the item to the interface
    UICtrl.addListItem(newItem, input.type);

    // 4. calculate the budget

    // 5. display the budget on the UI
  };


  return ({
    init: function() {
      console.log("Application has started");
      addEventListener();
    }
  });

})(budgetController, UIController);

appController.init(); 