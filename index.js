
import inquirer from "inquirer";
import fs from "fs"




function applicationStart(){
    console.log("-----------------------------------------------------") 
    console.log("\n               Timesheet Tracker!                \n")
    console.log("-----------------------------------------------------") 
    menu();
}

function menu(){
    


    inquirer.prompt({
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            "Add Timesheet Entry",
            "Add New Job Details",
            "Delete Job Details",
            "Quit"
        ]
    })
    .then((result)=>{
        switch(result.action){
        case "Add Timesheet Entry":
            timesheetEntry();
            break;
        case "Add New Job Details":
            newJobDetails();
            break;
        case "Delete Job Details":
            deleteJobDetails();
            break;
        case "Quit":
            process.exit(1);
            break;  
        }
    })
}


function timesheetEntry(){
    console.log("-----------------------------------------------------") 
    console.log("\n             Adding Timesheet Entry              \n")
    console.log("-----------------------------------------------------") 

    fs.readFile('jobs.csv', 'utf-8', (err,data)=>{

        var splitData = data.split("\n")
        inquirer.prompt([
            {
                type: 'list',
                name: 'timesheetEntry',
                message: "What did you do in the last hour?",
                choices: splitData
            }]
    ).then((answers)=>{
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        var newTimesheetEntry = dateTime + "," + answers.timesheetEntry

        fs.writeFile('timesheet.csv', newTimesheetEntry + '\n' ,{flag: 'a+', encoding:'utf-8'}, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        console.log("-----------------------------------------------------") 
        console.log("\n             Timesheet Entry Added               \n")
        console.log("-----------------------------------------------------") 

        
    })
})


}

function newJobDetails(){
    console.log("-----------------------------------------------------") 
    console.log("\n                  Adding New Job                 \n")
    console.log("-----------------------------------------------------") 
    inquirer.prompt([
        {
            type: 'input',
            name: 'jobNumber',
            message: "What is the Job Number?",
        },  
        {
            type: 'input',
            name: 'jobName',
            message: "What is the Job Name?",
        }
        ])
        .then((answers)=>{



            const jobNumber = answers.jobNumber
            const jobName = answers.jobName
            const dataEntry = jobNumber + "," + jobName
            
            fs.writeFile('jobs.csv', dataEntry + '\n' ,{flag: 'a+', encoding:'utf-8'}, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            });
            console.log("-----------------------------------------------------") 
            console.log("\n                   New Job Added                 \n")
            console.log("-----------------------------------------------------") 
            menu();

        }) 
}

function deleteJobDetails(){
    console.log("-----------------------------------------------------") 
    console.log("\n                Deleting Job Details             \n")
    console.log("-----------------------------------------------------") 
    fs.readFile('jobs.csv', 'utf-8', (err,data)=>{
        var splitData = data.split("\n")
    
    inquirer.prompt([
        {
            type: 'list',
            name: 'timesheetEntry',
            message: "Which Job would you like to remove?",
            choices: splitData
        }])
        .then((answers)=>{
            var i;
            const newList=[];
            for(let i=0;i<splitData.length;i++){
                if(answers.timesheetEntry != splitData[i]){
                    newList.push(splitData[i]);
                    fs.writeFile('jobs.csv', newList.join('\n') ,{flag: 'w+', encoding:'utf-8'}, (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        });
                }
            }
            console.log("-----------------------------------------------------") 
            console.log("\n                   Job Removed!                  \n")
            console.log("-----------------------------------------------------") 
            
            menu();

        }) })
}

applicationStart();