CREATE TABLE public.products (
	id uuid NOT_NULL primary key,
	title text NOT_NULL,
	description text NULL,
	price int4 NULL
);

CREATE TABLE public.stocks (
	product_id uuid NULL,
	count integer NULL,
	CONSTRAINT stocks_fk FOREIGN KEY (product_id) REFERENCES public.products(id)
);


INSERT INTO public.products
(id, title, description, price)
VALUES(gen_random_uuid(), 'NewProduct', 'Short Product Description', 50);

INSERT INTO public.stocks
(product_id, count)
VALUES('1382c676-c080-40bc-a462-57c7af0fc06e', 5);


INSERT INTO public.products
(id, title, description, price)
VALUES(gen_random_uuid(), 'NewProduct2', 'Short Product Description2', 30);

INSERT INTO public.stocks
(product_id, count)
VALUES('f7a82234-c1ce-415c-846d-bfad1c031f32', 3);

INSERT INTO public.products
(id, title, description, price)
VALUES(gen_random_uuid(), 'NewProduct3', 'Short Product Description3', 10);

INSERT INTO public.stocks
(product_id, count)
VALUES('0402f616-c76f-4922-b1e8-844e89aab862', 2);


select * from products inner join stocks on products.id = stocks.product_id 
