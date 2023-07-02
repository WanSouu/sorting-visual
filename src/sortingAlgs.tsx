
function quickSort(arr:Array<number>) {
    let newArr=[...arr]
    
    return(newArr)
}
function bubbleSort(arr:Array<number>, data:any) {
    let newArr=[...arr]
    console.log(data)
    if (data.step>=newArr.length-(data.iter+1)) {
        data.step=1;
        data.iter++;
    }else{
        data.step=data.step+1;
    }
    
    if (newArr[data.step]<newArr[data.step-1]) {
        let swapVal=newArr[data.step-1]
        newArr[data.step-1]=newArr[data.step]
        newArr[data.step]=swapVal
    }
    
    return(newArr)
}
function bogoSort(arr:Array<number>) {
    let bogoSortedArr=[...arr]
    let swapVal, swapPos;
    for(let i = 0; i < arr.length; i++) {
        swapPos=Math.round(Math.random()*(arr.length-1))
        swapVal=bogoSortedArr[swapPos]
        bogoSortedArr[swapPos]=bogoSortedArr[i]
        bogoSortedArr[i]=swapVal
    }
    return(bogoSortedArr)
}
function mergeSort(arr:Array<number>, data: any) {
    let newArr=[...arr]
    
    // Split the whole array into arrays of length 1
    if (data.step==1) {
        for(let i = 0; i < arr.length; i++) {
            data.mergeArrays[i]=[newArr[i]]
        }
    }else {
        // n(Compare, swap) merge
        let newMergeArrays=[]
        let newMergeArray;
        let compare=[];
        for(let i = 0; i < data.mergeArrays.length; i++) {
            newMergeArray=[]
            for(let j = 0; j < data.mergeArrays[i].length; j++) {
                compare=[
                    data.mergeArrays[i][0],
                    data.mergeArrays[i+1][0]
                ]
                if (compare[0]<compare[1]) {
                    newMergeArray.push(compare[0])
                    data.mergeArrays[i].shift()
                }else {
                    newMergeArray.push(compare[1])
                    data.mergeArrays[i+1].shift()
                }
            }
            newMergeArrays.push(newMergeArray)
        }
        data.mergeArrays=newMergeArrays
    }

    data.step++;
    return(newArr)
}

function getSortingAlgs() {
    return([
        new sortingAlg("Bogo sort", bogoSort),
        new sortingAlg("Bubble sort", bubbleSort, {step: 1, iter: 0}),
        //new sortingAlg("Merge sort", mergeSort, {step: 1, mergeArrays: []}),
        //new sortingAlg("Quick sort", quickSort)
    ])
}

class sortingAlg {
    name: string;
    func: (arr:number[], data?:object) => number[];
    data: object;
    constructor (name:string, func:(arr:number[], data?:object) => number[], data={}) {
        this.name=name
        this.data=data
        this.func=func
    }
}
export let sortingAlgs = getSortingAlgs()  // exporting an array of sorting algs that is returned from sortingArray