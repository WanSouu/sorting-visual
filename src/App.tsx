import { Button, Center, Checkbox, Group, NativeSelect, Paper, Slider, Stack, Text, createStyles } from '@mantine/core';
import { ThemeProvider } from './ThemeProvider';
import { useState, useEffect } from 'react';
import { sortingAlgs } from './sortingAlgs' 
import { useInterval } from '@mantine/hooks';

let sorted=false;

const useStyles = createStyles((theme) => ({
  sorterColumn: {
    background: 'white',
    borderRadius: '999px 999px 0px 0px'
  }
}))

interface sortorOptionsInterface {
  sortingAlg: any,
  width: number,
  speed: number,
  randomHeight: boolean,
  run: boolean,
  sortingArr: Array<number>,
  sorted: boolean
}

const defaultSorterOptions:sortorOptionsInterface = {
  sortingAlg: sortingAlgs[0] as any,
  width: 5,
  randomHeight:false,
  speed:0.33,
  run: false,
  sortingArr: createSortingArray(5, true),
  sorted: false
}

function setSortData(variables:object) {
  for (const [key, value] of Object.entries(variables)) {
    console.log(`${key}: ${value}`);
  }
}

function createSortingArray(width:number, randomHeight:boolean) {
  let arr=[]
  if (randomHeight) {
    let j = 1/width
    for(let i = 0; i < width; i++) {
      arr.push(Math.ceil(Math.random()/j)*j)
    }
  }else {
    let j;
    for(let i = 0; i < width; i++) {
      arr.push(0)
      j=Math.round(Math.random()*i)
      arr[i]=arr[j]
      arr[j]=(i+1)/width
    }
  }
  return(arr)
}

function SorterDisplay({sortingArray}:{sortingArray:Array<Number>}) {
  const { classes } = useStyles();

  return(
  <Group h='100%' grow spacing={0} align="flex-end">
    {
    sortingArray.map((cur:any, index) => {
      return(<div key={index} style={{height: `${cur*100}%`}} className={classes.sorterColumn}/>)
    })
    }
  </Group>)
}

interface changeInterface {
  alg: (newAlg:number) => void,
  width: (newWidth:number) => void,
  speed: (newSpeed:number) => void,
  randomHeight: (newRandomHeight:boolean) => void
}
interface sortingInterface {
  start: () => void,
  stop: () => void
}

interface sorterOptionsPropsInterface {
  sorterOptions:sortorOptionsInterface,
  change: changeInterface,
  sorting: sortingInterface,
  active: boolean
}

function SorterOptions({ sorterOptions, change, sorting, active }: sorterOptionsPropsInterface) {
  let dataArr=sortingAlgs.map((cur) => cur.name)

  return(
    <Stack>
      <Stack px="5%">
        <Stack spacing={0}>
          <Text>Sorting algorithm</Text>
          <NativeSelect
            data={dataArr}
            onChange={(v) => change.alg(dataArr.indexOf(v.currentTarget.value))}
          />
        </Stack>
        <Stack spacing={0}>
          <Text>Random height</Text>
          <Checkbox onChange={(v) => change.randomHeight(v.currentTarget.checked)}/>
        </Stack>
        <Stack spacing={0}>
          Width
          <Slider disabled={!active} step={1} min={2} max={100} label={null} value={sorterOptions.width} onChange={change.width}/>
        </Stack>
        <Stack spacing={0}>
          Speed
          <Slider disabled={!active} label={null} max={1} step={0.01} value={sorterOptions.speed} onChange={change.speed}/>
        </Stack>
        <Button onClick={sorterOptions.run ? sorting.stop : sorting.start} >{sorterOptions.run ? "Stop" : "Start"}</Button>
      </Stack>
    </Stack>
  )
}

function checkIfSorted(arr:Array<number>) {
  let j = 0;
  for(let k = 0; k < arr.length; k++) {
    if (j<=arr[k]) { j=arr[k] }
    else { return(false) }
  }
  return(true)
}
let sorterData={}
let midSort=false;
function SorterController() {
  const [sorterOptions, setSorterOptions] = useState(defaultSorterOptions)
  const sortingInterval = useInterval(() => {
    setSorterOptions((currentOptions) => {
      let newSortedArr = sorterOptions.sortingAlg.func(currentOptions.sortingArr, sorterData)
      let isSorted = checkIfSorted(newSortedArr)
      return {...currentOptions,sortingArr: newSortedArr, sorted: isSorted, run: !isSorted}
    })
  }, 1000*(1-sorterOptions.speed));

  useEffect(() => {
    if (sorterOptions.run==true && sorterOptions.sorted==false) {
      sortingInterval.start();
    }else { sortingInterval.stop(); }
    return sortingInterval.stop
  },[sorterOptions.run, sorterOptions.sorted])

  const change = {
    alg: (newAlg:number) => {setSorterOptions((currentOptions) => ({...currentOptions, sortingAlg: sortingAlgs[newAlg]}))},
    width: (newWidth:number) => {setSorterOptions((currentOptions) => ({...currentOptions, width: newWidth, sortingArr: ((currentOptions.sortingArr.length==newWidth) ? currentOptions.sortingArr : createSortingArray(newWidth,currentOptions.randomHeight))}))},
    speed: (newSpeed:number) => {setSorterOptions((currentOptions) => ({...currentOptions, speed: newSpeed}))}, 
    randomHeight: (newRandomHeight:boolean) => {setSorterOptions((currentOptions) => ({...currentOptions, randomHeight: newRandomHeight, sortingArr: createSortingArray(currentOptions.width, newRandomHeight)}))}
  };
  
  const sorting = {
    start: () => {
      setSorterOptions((currentOptions) => {
        sorterData={...currentOptions.sortingAlg.data}
        return {...currentOptions,run: true, sorted: false, sortingArr: currentOptions.sorted ? createSortingArray(currentOptions.width, currentOptions.randomHeight) : currentOptions.sortingArr}
      })
    },
    stop: () => {setSorterOptions((currentOptions) => ({...currentOptions,run: false}))}
  }

  return(
    <Paper w="90vw" h="85vh" p="md" withBorder>
      <Group grow h='100%'>
        <SorterDisplay sortingArray={sorterOptions.sortingArr} />
        <SorterOptions active={!sorterOptions.run} sorting={sorting} change={change} sorterOptions={sorterOptions}/>
      </Group>
    </Paper>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Center h="100vh" w="100vw">
        <SorterController />
      </Center>
    </ThemeProvider>
  );
}
