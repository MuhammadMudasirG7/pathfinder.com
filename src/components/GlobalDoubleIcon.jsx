import { Button } from 'primereact/button';

export default function GlobalDoubleIcon({ title, onToggle, isOpen }) {
    return (
        <div className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded mt-4">
            
            <h1 className="ml-3 text-[16px] text-gray-600 font-bold ">{title}</h1>
            
            <button onClick={onToggle} className='p-2 hover:bg-gray-200 text-gray-600 rounded-full transition-colors flex items-center justify-center'>
              <i className={`${isOpen ? "pi pi-angle-double-up" : "pi pi-angle-double-down"}  text-2xl font-bold`}></i>
            </button>
            
        </div>
    );
}