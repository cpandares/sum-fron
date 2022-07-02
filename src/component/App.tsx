import axios from "axios";

import { useEffect, useMemo, useState } from "react";
import { useForm, Resolver } from "react-hook-form";

import { API } from "../request/request";

type FormValues = {
  number1: string;
  number2: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.number1 ? values : {} || values.number2 ? values : {},
    errors:
      !values.number1 || !values.number2 || !parseInt(values.number1) || !parseInt(values.number2)
        ? {
            number1: {
              type: "required",
              message: "This is required.",
            },
            number2: {
              type: "required",
              message: "This is required.",
            },
          }
        : {},
    
  };
};

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  const [total, setTotal] = useState([]);
  const [result, setResult] = useState(0);

  const onSubmit = handleSubmit((data) => {
    axios.post(API + "summary", data)
      .then((res) => {
        setResult(res.data.sum.result);
        setTotal(res.data.data);
       
      })
      .catch((e) => console.log(e));
  });

 

  useEffect(() => {

    let mounted = true;


      axios.get(API + "get-summary")
        .then((res) => {
         if(mounted)  setTotal(res.data.data);
        })
        .catch((e) => console.log(e));

    

  }, [setTotal]);

 

  return (
    <div>
      <section className="sum__header">
        <h1>Calculator</h1>
      </section>
      <div className="login card shadow">
        <div className="form__container">
          <h4 className="text-muted">Enter the numbers</h4>
          <form className="form" onSubmit={onSubmit}>
            <input
              autoComplete="off"
              type="text"
              id="number1"
              className="input"
              placeholder="Please enter number 1"
              {...register("number1")}
              pattern="[0-9]{0,13}"
            />
            {errors?.number1 && <p>{errors.number1.message}</p>}
            <input
               autoComplete="off"
              type="text"
              id="number2"
              className="input"
              placeholder="Please enter number 2"
              {...register("number2")}
            />
            {errors?.number2 && <p>{errors.number2.message}</p>}
            <button
              type="submit"             
              className="primary-button"
            >
              Sum
            </button>
           
          </form>
         
        </div>
          <hr id="linea" />
          <div className="secondary-text">
            {total?.map((number) => {
              return <span > {number} </span>;
            })}

          </div>
      </div>
    </div>
  );
};

export default App;
