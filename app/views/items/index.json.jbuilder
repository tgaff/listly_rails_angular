json.array!(@items) do |item|
  json.extract! item, :id, :name, :list_id
  json.url list_item_url(@list, item, format: :json)
end
