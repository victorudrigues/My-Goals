import { useSQLiteContext } from "expo-sqlite/next"

export type GoalCreateDatabase = {
    name: string
    total: string
}

//HOOK
export function useGoalRespository(){
    const database = useSQLiteContext()
    
    function create(goal: GoalCreateDatabase){
        const statement = database.prepareSync(
            "INSERT INTO goals (name, total) VALUES($name ,$total)"
        )

        statement.executeAsync({
            $name: goal.name,
            $total: goal.total
        })
    }

    return {
        create,
    }
}