import { useMutation } from "@apollo/client"
import { useState } from "react"
import { EDIT_AUTHOR } from '../graphqlQueries/editAuthor'


const SetBirthday = () => {

    const [name, setName] = useState('')
    const [year, setYear] = useState('')

    const [ editAuthor ] = useMutation(EDIT_AUTHOR)

    const submit = async (event) => {
        event.preventDefault()

        editAuthor({ variables: {name, year}})

        setName('')
        setYear('')

    }

    return(
        <div>
            <h2>Set Birthday </h2>
            <form onSubmit={submit}>
                <div>name
                    <input 
                    value={name}
                    onChange={({ target }) =>  setName(target.value)}
                    />
                </div>
                <div>
                    born
                    <input 
                        type="number"
                        value={year}
                        onChange={({ target }) => setYear(Number(target.value))}
                    />
                </div>
                <button type="submit">update author</button>
            </form>
        </div>
    )
}

export default SetBirthday