/*----------------------------------------------*/
/*         BUDGET CONTROLLER                    */
/*----------------------------------------------*/
var budgetController = (function () {
    
    //Function constructor for expenses items
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    //Calculate percentage method stored in Expense object's prototype
    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0) {
           this.percentage = Math.round((this.value/totalIncome) * 100); 
        } else {
            this.percentage = -1;
        }     
    };
    
    //Function to get percentage from Expense object
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
    
    //Function constructor for income items
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }; 
    
    //Function to sum up items in an array    
    var calculateTotal = function(type){
        var sum = 0;
        
        //Array.forEach(current, index, array)
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        
        //Store in data object
        data.totals[type] = sum;        
        
    };
    
    
    //Object to store budget incomes, expenses, and their respective totals
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            //Create new ID for the item
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }                       
            
            //Create newItem based on type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            //Add item to allItems data object based on type
            data.allItems[type].push(newItem);
            //Return the new element
            return newItem;    
        },
        
        //Delete item from data object
        deleteItem: function(type, id) {
            var ids, index;
            
            //Returns an array of ids
            ids = data.allItems[type].map(function(current){
                return current.id;                
            });
            
            //Get index of id. (Returns -1 if not found)
            index = ids.indexOf(id);
            
            //Delete if found
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
        
        calculateBudget: function(){
            //Calculate total incomes and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            //Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;            
            
            //Calculate the percentage of income/budget
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
                   
        },
        
        
        calculatePercentages: function(){
          data.allItems.exp.forEach(function(cur){
              cur.calcPercentage(data.totals.inc);              
          }); 
        },
        
        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();                
            });
            return allPerc;
        },
        
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
             
        },
        
        testing: function(){
            console.log(data);
        }
    };
})();


/*----------------------------------------------*/
/*         USER INTERFACE CONTROLLER            */
/*----------------------------------------------*/
var UIController = (function () {
    
    var DOMStrings = {
        inputType:          '.add__type',
        inputDescription:   '.add__description',
        inputValue:         '.add__value',
        inputBtn:           '.add__btn',
        incomeContainer:    '.income__list',
        expensesContainer:  '.expenses__list',
        budgetLabel:        '.budget__value',
        incomeLabel:        '.budget__income--value',
        expensesLabel:      '.budget__expenses--value',
        percentageLabel:    '.budget__expenses--percentage',
        container:          '.container',
        expensesPercLabel:  '.item__percentage',
        dateLabel:          '.budget__title--month'
    };
    
    var formatNumber = function(num, type){
            var numSplit, int, dec;
            
            /* 
            + or - before number
            exactly two decimal points
            comma separating the thousands 
            Eg.
            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */
            
            //Get absolute value of number i.e. remove the sign. Returns a number
            num = Math.abs(num);            
            //Converts to fixed number. Returns as string
            num = num.toFixed(2);
            //Splits at decimal point
            numSplit = num.split('.');
            //Integer and decimal parts
            int = numSplit[0];
            dec = numSplit[1];
            //Add comma between thousands
            if (int.length > 3) {
                var pre = int.length % 3;
                var newInt = '';
                var newInt2 = '';
                if (pre !== 0){
                    //Create a new integer string
                    newInt = int.slice(0, pre) + ',';
                    //Create a second integer string starting from the first one
                    newInt2 = int.substr(pre, int.length - pre);
                } 
                
                //Add the strings together
                for (var i = 0; i < newInt2.length; i+=3) {
                    newInt = newInt + newInt2.substr(i,3) + ',';
                }
                
                //Remove the last comma
                newInt = newInt.substr(0, newInt.length - 1);
                
                //Reassign as int
                int = newInt;                
                
            }
            //Add + or -
            //Put number back together
            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;     
            
        }
    
    //Loop through all nodes with custom forEach function
    var nodeListForEach = function(list, callback){
                for (var i = 0; i < list.length; i++){
                    callback(list[i], i);
                }             
            };

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Gets value part of selector. Will be 'inc' or 'exp'.
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };            
        },
        
        addListItem: function(obj, type){
            var html, newHtml, element;
            // Create HTML string with placeholder text            
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';                
            }
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },
        
        //Delete item from DOM
        deleteListItem: function(selectorID){
            var el;
            //Strange but that's how you remove a child node in the DOM
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        clearFields: function() {
            //Variable to hold fields
            var fields, fieldsArr;
            
            //Select the fields we want
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            
            //querySelectorAll returns a list not an array. We need to change it to an array by borrowing an Array method
            //The returned object is an array
            fieldsArr = Array.prototype.slice.call(fields);
            
            //Clear each field in the array
            fieldsArr.forEach(function(current, index, array){
                current.value = "";                
            });
            
            //Set focus back to inputDescription
            fieldsArr[0].focus();
            
        },
        
        displayBudget: function(obj){
            var type;
            //Determine if budget is positive or negative
            if (obj.budget === 0) {
                document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            } else {
                obj.budget > 0 ? type = 'inc' : type = 'exp';
                document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            }    
            
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            
            if (obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            }            
        },
        
        displayPercentages: function(percentages) {
            var fields;
            
            //querySelectorAll returns a node list
            fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            
            nodeListForEach(fields, function(current, index){
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }        
            });
        },
        
        displayMonth: function(){
            var now, months, month, year;
            
            months = $months = [
                                'January',
                                'February',
                                'March',
                                'April',
                                'May',
                                'June',
                                'July',
                                'August',
                                'September',
                                'October',
                                'November',
                                'December'
                                ];
            
            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ', ' + year;
        },
        
        changedType: function(){
            var fields;
            
            fields = document.querySelectorAll(
                DOMStrings.inputType + ', ' + 
                DOMStrings.inputDescription + ', ' +
                DOMStrings.inputValue);
            
            //Loop through above elements and toggle class to change colors between blue and red
            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');                
            });
            
            //Toggle colors between blue and red for button
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },
            
        getDOMStrings: function(){
            return DOMStrings;
        }
    };

})();



/*----------------------------------------------*/
/*         GLOBAL APP CONTROLLER                */
/*----------------------------------------------*/
var controller = (function (budgetCtrl, UICtrl) {
    
      //Set up all event listeners
      var setupEventListeners = function(){
        
      //A local variable to hold all the DOM strings
      var DOM = UICtrl.getDOMStrings();        
      document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);        
      document.addEventListener('keypress', function(event) {
        
        //'Enter' key is keyCode 13. Older browsers use "which
        if(event.keyCode === 13 || event.which === 13){            
            //Call ctrlAddItem
            ctrlAddItem();
        }
      }); 
          
      //Event listeners for delete buttons
      document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);   
      //Event listeners for + or - selector
      document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
        
    };
    
    //Update the budget
    var updateBudget = function() {
        
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        
        // 3. Display the budget on the user interface
        UICtrl.displayBudget(budget);        
    }
    
    //Update percentages
    var updatePercentages = function() {
        var percentages;
        
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        
        // 2. Read percentages from the budget controller
        percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
        
    };    

    //Add items
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get field input data
        input = UICtrl.getInput();
        
        if ((input.description !== "" && !isNaN(input.value)) && input.value > 0) {
            // 2. Add item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
            // 3. Add item to the user interface
            UICtrl.addListItem(newItem, input.type);
        
            // 4. Clear the fields
            UICtrl.clearFields();
        
            // 5. Calculate and update budget
            updateBudget();
            
            // 6. Calculate and update percentages
            updatePercentages();
        }      
    };
    
    //Delete income and expense objects.
    //Has event object fired from event
    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        
        //Target parent element * 4 for event delegation
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        //If item id exists...
        if (itemID) {
            //split id into type and id number
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. Delete item from data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete item from the UI
            UICtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget
            updateBudget();
            
            // 4. Calculate and update percentages
            updatePercentages();
        }
        
        
    };
    
    //Initalization function
    return {
        init: function(){
            console.log('Application started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1
            });
            setupEventListeners();
        }
        
    }; 


})(budgetController, UIController);

//Start the application
controller.init();
