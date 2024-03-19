import { useSQLiteContext } from "expo-sqlite/next"

//HOOK
export function useGoalRespository(){
    const database = useSQLiteContext()
    
    function create(goal: GoalCreateDatabase){
        try{
            const statement = database.prepareSync(
                "INSERT INTO goals (name, total) VALUES($name ,$total)"
            )
    
            statement.executeAsync({
                $name: goal.name,
                $total: goal.total
            })
        }
        catch(error){
            throw error;
        }
        
    }

    function all(){
        try{
            return database.getAllSync<GoalResponseDatabase>(`
                SELECT g.id, g.name, g.total , COALESCE(SUM(t.amount), 0) AS current
                FROM goals AS g
                LEFT JOIN transactions t ON t.goal_id = g.id
                GROUP BY g.id, g.name, g.total;
            `)
        }
        catch(error){
            throw error
        }
    }

    function show(id: number){
        const statement = database.prepareSync(`
            SELECT g.id, g.name, g.total , COALESCE(SUM(t.amount), 0) AS current
            FROM goals AS g
            LEFT JOIN transactions t ON t.goal_id = g.id
            where g.id = $id
            GROUP BY g.id, g.name, g.total;
        `);

        const result = statement.executeSync<GoalResponseDatabase>({$id: id})

        return result.getFirstSync()
    }
    

    return {
        create,
        all,
        show
    }
}