File.open('seeds.txt', 'w') do |f|
  # ARGF.each do |line|
  #   puts line
  #   tokens = line.split ','
  #   country = tokens[1]
  #
  #   cmd = "TableName.create country: #{country}"
  #   f.puts cmd
  # end

  # ARGF.each do |line|
  #   tokens = line.split ','
  #   time = tokens[9]
  #
  #   timecmd = "TableName.create time: #{time}"
  #   f.puts timecmd
  # end

  ARGF.each do |line|
    tokens = line.split ','
    value = tokens[16]

    percmd = "TableName.create percentage: #{value}"
    f.puts percmd
  end
end
