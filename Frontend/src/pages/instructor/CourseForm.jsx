import { Form, Button } from "react-bootstrap";

export default function CourseForm({
  form,
  setForm,
  onSubmit,
  loading,
  mode = "create"
}) {

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Form onSubmit={onSubmit}>

      {/* TITLE */}
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* DESCRIPTION */}
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* CATEGORY */}
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Control
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* PRICE */}
      <Form.Group className="mb-3">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* THUMBNAIL */}
      <Form.Group className="mb-3">
        <Form.Label>Thumbnail</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm({ ...form, thumbnail: e.target.files[0] })
          }
        />
      </Form.Group>

      <Button type="submit" variant="dark" disabled={loading}>
        {loading
          ? "Processing..."
          : mode === "create"
          ? "Create Course"
          : "Update Course"}
      </Button>

    </Form>
  );
}