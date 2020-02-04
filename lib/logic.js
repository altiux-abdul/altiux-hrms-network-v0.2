
/*
* Sample transcation processor function
* @param {altiux.FundTransferByManager} ft
* @transaction
*/
async function  FundTransferByManager(ft)
{
    let WalletRegistry = await getAssetRegistry('altiux.Wallet');
    let ManagerRegistry = await getParticipantRegistry('altiux.Manager');
    let FundRegistry = await getAssetRegistry('altiux.Funds');
    let WalletIdExist = await WalletRegistry.exists(ft.manager.wallet.walletId);
    let ManagerIdExist = await ManagerRegistry.exists(ft.manager.managerId);
    if(WalletIdExist && ManagerIdExist){
        if(ft.manager.wallet.balance > ft.amount){
            ft.fund.balance += ft.amount
            ft.manager.wallet.balance -=ft.amount
            
            await WalletRegistry.update(ft.manager.wallet);  
            await FundRegistry.update(ft.fund);
        }
        else{
        throw new Error("Insufficient balance in managers account")
        }
    }
    else{
        throw new Error('Either Wallet Or Manager Doesnot Exist');
    }   
}
/*
* Sample transcation processor function
* @param {altiux.FundTransferByCustomer} ftc
* @transaction
*/

async function  FundTransferByCustomer(ftc)
{
    let WalletRegistry = await getAssetRegistry('altiux.Wallet');
    let CustomerRegistry = await getParticipantRegistry('altiux.Customer');
    let FundRegistry = await getAssetRegistry('altiux.Funds');
    let WalletIdExist = await WalletRegistry.exists(ftc.customer.wallet.walletId);
    let CustomerIdExist = await CustomerRegistry.exists(ftc.customer.customerId);
    if(WalletIdExist && CustomerIdExist){
        if(ftc.customer.wallet.balance > ftc.amount){
            ftc.fund.balance += ftc.amount
            ftc.customer.wallet.balance -=ftc.amount
            
            await WalletRegistry.update(ftc.customer.wallet);  
            await FundRegistry.update(ftc.fund);
        }
        else{
        throw new Error("Insufficient balance in customers account")
        }
    }
    else{
        throw new Error('Either Wallet Or Customer Doesnot Exist');
    }   
}

/*
* Sample transcation processor function
* @param {altiux.EmployeeSalary} es
* @transaction
*/

function EmployeeSalary(es)
{
    if(es.employee.salaryStatus == "UNPAID")
    {
      if(es.employee.status != "APPROVED") {
        throw new Error("Employee not verified by HR department")
      }
      if(es.fund.balance > es.employee.salary)
        {
            es.fund.balance -= es.employee.salary
            es.employee.wallet.balance += es.employee.salary
            
            es.employee.salaryStatus = "PAID"

            return getAssetRegistry('altiux.Funds')
            .then(function(accRegistry){
                return accRegistry.update(es.fund);
            }).then(function(){
                return getAssetRegistry('altiux.Wallet');
            }).then(function(accRegistry){
                return accRegistry.update(es.employee.wallet);
            }).then(function(){
                return getParticipantRegistry('altiux.Employee');
            }).then(function(participantRegistry){
                return participantRegistry.update(es.employee);
            });
        }
        else{
            throw new Error("Fund Balance insufficient")
        }
        
    }
    else{
        throw new Error("You are already paid")
    }
}

/**
 * sample transaction
 * @param {altiux.UpdateEmployee} ue 
 * @transaction
 */
function UpdateEmployee(ue) {
	var manager = getCurrentParticipant();
    //update values of the assets
    ue.employee.status = 'APPROVED';
    ue.employee.approver = manager.managerId;
    return getParticipantRegistry('altiux.Employee')
        .then(function (participantRegistry) {
           return participantRegistry.update(ue.employee);
});
}
