export default function DialogDelete ({ alg, dialogRef, closeDeleteDialog, handleDelete }) {
    return (
        <dialog ref={dialogRef} className="delete-dialog" onCancel={closeDeleteDialog}>
            <div className="delete-dialog-content">
                <h2 className="text-2xl text-center text-white">¿Deseas eliminar este algoritmo?</h2>
                <p className="text-center text-gray">
                    Esta acción eliminará{" "}
                    <strong>{alg.title || "Sin título"}</strong>.
                    Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-md">
                    <button type="button" className="btn btn-secondary" onClick={closeDeleteDialog}>Cancelar</button>
                    <button type="button" className="btn btn-primary" onClick={handleDelete}>Eliminar</button>
                </div>
            </div>
        </dialog>
    )
}