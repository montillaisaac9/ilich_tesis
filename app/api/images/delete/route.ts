interface Props {
  filename: string;
}

export default function DeleteImage({ filename }: Props) {
  const handleDelete = async () => {
    const res = await fetch(`/api/delete?filename=${filename}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (data.success) alert("Imagen eliminada");
  };

  return <button onClick={handleDelete}>Eliminar Imagen</button>;
}
